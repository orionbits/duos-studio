import {
  errorBlockSchema,
  readingBlockSchema,
  shortAnswerExerciseSchema,
  fillBlankExerciseSchema,
  matchingExerciseSchema,
  classificationExerciseSchema,
  trueFalseExerciseSchema,
  verbConjugationExerciseSchema,
  longFormExerciseSchema,
  rolePlayExerciseSchema,
  orderingExerciseSchema,
  multipleChoiceExerciseSchema,
  validateAudioMetadata,
  type ErrorBlock,
  type ValidBlock
} from "@/lib/schemas";

type Category = "READING" | "EXERCISE";

type MetadataRecord = {
  id?: string;
  type?: string;
  audio?: boolean;
  audio_track?: string;
  tags?: string[];
  title?: string;
  instruction?: string;
};

type IndexedEntry = {
  index: number;
  value: string;
};

type AnswerValue = string | string[];

const BLOCK_REGEX =
  /\[(READING|EXERCISE)_START\]\s*([\s\S]*?)\s*\[\1_END\]\s*([\s\S]*?)(?=(?:\[(?:READING|EXERCISE)_START\])|$)/g;
const GROUPED_FILL_BLANK_REGEX = /^(.*?)\s-\s(\d+)$/;
const ERROR_RAW_LIMIT = 200;

export function parseTaggedInput(input: string): Array<ValidBlock | ErrorBlock> {
  const trimmedInput = input.trim();

  if (trimmedInput === "") {
    return [createErrorBlock("No blocks found", undefined, input)];
  }

  const matches = Array.from(trimmedInput.matchAll(BLOCK_REGEX));

  if (matches.length === 0) {
    return [createErrorBlock("No blocks found", undefined, input)];
  }

  const parsedBlocks = matches.map((match) => parseMatchedBlock(match));
  const duplicateErrors = findDuplicateIdErrors(parsedBlocks);
  
  return [...parsedBlocks, ...duplicateErrors];
}

export function parseBlock(blockText: string): ValidBlock | ErrorBlock {
  const trimmedBlock = blockText.trim();

  if (trimmedBlock === "") {
    return createErrorBlock("Block is empty", undefined, blockText);
  }

  const match = trimmedBlock.match(
    /^\[(READING|EXERCISE)_START\]\s*([\s\S]*?)\s*\[\1_END\]\s*([\s\S]*)$/
  );

  if (!match) {
    return createErrorBlock("Block not closed or invalid block markers", undefined, blockText);
  }

  return parseMatchedBlock(match);
}

function parseMatchedBlock(match: RegExpMatchArray): ValidBlock | ErrorBlock {
  const category = match[1] as Category;
  const metadataText = match[2] ?? "";
  const bodyText = (match[3] ?? "").trim();
  const rawInput = match[0] ?? "";
  const metadata = parseMetadata(metadataText);
  const blockId = metadata.id;

  const metadataError = validateMetadata(category, metadata, rawInput);
  if (metadataError) {
    return createErrorBlock(metadataError, blockId, rawInput);
  }

  if (category === "READING") {
    return parseReadingBlock(metadata, bodyText, rawInput);
  }

  return parseExerciseBlock(metadata, bodyText, rawInput);
}

function parseMetadata(metadataText: string): MetadataRecord {
  const metadata: MetadataRecord = {};
  const lines = metadataText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (key === "") {
      continue;
    }

    switch (key) {
      case "audio":
        metadata.audio = normalizeBoolean(rawValue);
        break;
      case "audio_track":
        metadata.audio_track = normalizeString(rawValue);
        break;
      case "tags":
        metadata.tags = parseTags(rawValue);
        break;
      case "id":
      case "type":
      case "title":
      case "instruction":
        metadata[key] = normalizeString(rawValue);
        break;
      default:
        break;
    }
  }

  return metadata;
}

function validateMetadata(
  category: Category,
  metadata: MetadataRecord,
  rawInput: string
): string | null {
  if (!metadata.id) {
    return "Missing required metadata field: id";
  }

  if (!metadata.type) {
    return "Missing required metadata field: type";
  }

  if (typeof metadata.audio !== "boolean") {
    return "Missing required metadata field: audio";
  }

  if (typeof metadata.audio_track !== "string") {
    return "Missing required metadata field: audio_track";
  }

  if (!Array.isArray(metadata.tags)) {
    return "Missing required metadata field: tags";
  }

  if (!validateAudioMetadata({
    audio: metadata.audio,
    audio_track: metadata.audio_track
  })) {
    return "Invalid audio metadata";
  }

  const allowedTypes =
    category === "READING"
      ? new Set([
          "dialogue",
          "monologue",
          "passage",
          "transcript",
          "cultural_note",
          "grammar_table",
          "vocabulary_list"
        ])
      : new Set([
          "short_answer",
          "fill_blank",
          "multiple_choice",
          "matching",
          "true_false",
          "verb_conjugation",
          "ordering",
          "role_play",
          "classification",
          "long_form"
        ]);

  if (!allowedTypes.has(metadata.type)) {
    return `Invalid type: ${metadata.type}`;
  }

  if (category === "READING" && !("title" in metadata)) {
    return "Missing required metadata field: title";
  }

  if (rawInput.trim() === "") {
    return "Block is empty";
  }

  return null;
}

function parseReadingBlock(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const rawContent = extractRawContent(bodyText);
  const parsed = readingBlockSchema.safeParse({
    category: "READING",
    metadata: {
      id: metadata.id,
      type: metadata.type,
      title: metadata.title,
      audio: metadata.audio,
      audio_track: metadata.audio_track,
      tags: metadata.tags
    },
    raw_content: rawContent
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid reading block", metadata.id, rawInput);
}

function parseExerciseBlock(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  switch (metadata.type) {
    case "short_answer":
      return parseQuestionAnswerExercise(metadata, bodyText, rawInput, shortAnswerExerciseSchema);
    case "true_false":
      return parseQuestionAnswerExercise(metadata, bodyText, rawInput, trueFalseExerciseSchema);
    case "verb_conjugation":
      return parseQuestionAnswerExercise(
        metadata,
        bodyText,
        rawInput,
        verbConjugationExerciseSchema
      );
    case "fill_blank":
      return parseFillBlankExercise(metadata, bodyText, rawInput);
    case "matching":
      return parseMatchingExercise(metadata, bodyText, rawInput);
    case "classification":
      return parseClassificationExercise(metadata, bodyText, rawInput);
    case "long_form":
      return parsePromptAnswerExercise(metadata, bodyText, rawInput, longFormExerciseSchema, true);
    case "role_play":
      return parsePromptAnswerExercise(metadata, bodyText, rawInput, rolePlayExerciseSchema, false);
    case "ordering":
      return parseOrderingExercise(metadata, bodyText, rawInput);
    case "multiple_choice":
      return parseMultipleChoiceExercise(metadata, bodyText, rawInput);
    default:
      return createErrorBlock(`Invalid type: ${metadata.type}`, metadata.id, rawInput);
  }
}

function parseQuestionAnswerExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string,
  schema:
    | typeof shortAnswerExerciseSchema
    | typeof trueFalseExerciseSchema
    | typeof verbConjugationExerciseSchema
): ValidBlock | ErrorBlock {
  const questions = parseIndexedValues(bodyText, "Question");
  const answers = parseIndexedValues(bodyText, "Answer");

  if (questions.length === 0) {
    return createErrorBlock("No questions found", metadata.id, rawInput);
  }

  const items = buildPairedItems(questions, answers, metadata.id, "question");
  if (isErrorBlock(items)) {
    return items;
  }

  const parsed = schema.safeParse({
    category: "EXERCISE",
    metadata: buildExerciseMetadata(metadata),
    items
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid exercise block", metadata.id, rawInput);
}

function parseFillBlankExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const questions = parseIndexedValues(bodyText, "Question");
  const answers = parseIndexedValues(bodyText, "Answer");

  if (questions.length === 0) {
    return createErrorBlock("No questions found", metadata.id, rawInput);
  }

  const paired = buildPairedItems(questions, answers, metadata.id, "question");
  if (isErrorBlock(paired)) {
    return paired;
  }

  const grouped = paired.every((item) => GROUPED_FILL_BLANK_REGEX.test(item.question));

  const candidate = grouped
    ? buildGroupedFillBlankBlock(metadata, paired)
    : {
        category: "EXERCISE" as const,
        metadata: buildExerciseMetadata(metadata),
        items: paired
      };

  const parsed = fillBlankExerciseSchema.safeParse(candidate);

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid fill_blank block", metadata.id, rawInput);
}

function buildGroupedFillBlankBlock(
  metadata: MetadataRecord,
  items: Array<{ question: string; answer: AnswerValue }>
) {
  const parsedItems = items.map((item) => {
    const match = item.question.match(GROUPED_FILL_BLANK_REGEX);

    return {
      baseText: match?.[1]?.trim() ?? item.question,
      position: Number(match?.[2]),
      answer: item.answer
    };
  });

  const baseText = parsedItems[0]?.baseText ?? "";

  return {
    category: "EXERCISE" as const,
    metadata: buildExerciseMetadata(metadata),
    base_text: baseText,
    blanks: parsedItems
      .sort((left, right) => left.position - right.position)
      .map((item) => ({
        position: item.position,
        answer: item.answer
      }))
  };
}

function parseMatchingExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const leftMap = parseIndexedMap(bodyText, "Left");
  const rightMap = parseIndexedMap(bodyText, "Right");
  const rightKeys = Object.keys(rightMap);

  if (rightKeys.length === 0) {
    return createErrorBlock("No matching pairs found", metadata.id, rawInput);
  }

  const items = rightKeys
    .sort(compareIndexedLabels)
    .map((rightKey) => {
      const leftKey = findMatchingLeftKey(rightKey, leftMap);
      if (!leftKey) {
        return null;
      }

      return {
        left: leftMap[leftKey],
        right: rightMap[rightKey]
      };
    });

  if (items.some((item) => item === null)) {
    return createErrorBlock("Invalid matching structure", metadata.id, rawInput);
  }

  const parsed = matchingExerciseSchema.safeParse({
    category: "EXERCISE",
    metadata: buildExerciseMetadata(metadata),
    items
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid matching block", metadata.id, rawInput);
}

function parseClassificationExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const itemsMap = parseIndexedMap(bodyText, "Item");
  const answersMap = parseIndexedMap(bodyText, "Answer");
  const keys = Object.keys(itemsMap).sort(compareIndexedLabels);

  if (keys.length === 0) {
    return createErrorBlock("No classification items found", metadata.id, rawInput);
  }

  const items = keys.map((key) => {
    const answer = answersMap[key];

    if (typeof answer !== "string") {
      return null;
    }

    return {
      item: itemsMap[key],
      answer
    };
  });

  if (items.some((item) => item === null)) {
    return createErrorBlock("Missing answer for classification item", metadata.id, rawInput);
  }

  const parsed = classificationExerciseSchema.safeParse({
    category: "EXERCISE",
    metadata: buildExerciseMetadata(metadata),
    items
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid classification block", metadata.id, rawInput);
}

function parsePromptAnswerExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string,
  schema: typeof longFormExerciseSchema | typeof rolePlayExerciseSchema,
  answerRequired: boolean
): ValidBlock | ErrorBlock {
  const prompt = parseSingleField(bodyText, "Prompt");
  const answer = parseSingleField(bodyText, "Answer");

  if (!prompt) {
    return createErrorBlock("Missing prompt", metadata.id, rawInput);
  }

  if (answerRequired && !answer) {
    return createErrorBlock("Missing answer", metadata.id, rawInput);
  }

  const parsed = schema.safeParse({
    category: "EXERCISE",
    metadata: buildExerciseMetadata(metadata),
    prompt,
    answer: answer ?? null
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid prompt/answer block", metadata.id, rawInput);
}

function parseOrderingExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const itemsField = parseSingleField(bodyText, "Items");
  const correctOrderField =
    parseSingleField(bodyText, "Correct Order") ??
    parseSingleField(bodyText, "Correct Sequence");

  let candidate:
    | {
        category: "EXERCISE";
        metadata: ReturnType<typeof buildExerciseMetadata>;
        items: Array<string | { position: number; text: string }>;
        correct_order: number[];
      }
    | null = null;

  if (itemsField && correctOrderField) {
    const parsedItems = parseStringArray(itemsField);
    const parsedOrder = parseNumberArray(correctOrderField);

    if (!parsedItems || !parsedOrder) {
      return createErrorBlock("Invalid ordering structure", metadata.id, rawInput);
    }

    candidate = {
      category: "EXERCISE",
      metadata: buildExerciseMetadata(metadata),
      items: parsedItems,
      correct_order: parsedOrder
    };
  } else {
    const itemsMap = parseIndexedMap(bodyText, "Item");
    const parsedOrder = correctOrderField ? parseNumberArray(correctOrderField) : null;
    const itemKeys = Object.keys(itemsMap).sort(compareIndexedLabels);

    if (itemKeys.length === 0 || !parsedOrder) {
      return createErrorBlock("Invalid ordering structure", metadata.id, rawInput);
    }

    candidate = {
      category: "EXERCISE",
      metadata: buildExerciseMetadata(metadata),
      items: itemKeys.map((key) => ({
        position: Number.parseInt(key, 10),
        text: itemsMap[key]
      })),
      correct_order: parsedOrder
    };
  }

  const parsed = orderingExerciseSchema.safeParse(candidate);

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid ordering block", metadata.id, rawInput);
}

function parseMultipleChoiceExercise(
  metadata: MetadataRecord,
  bodyText: string,
  rawInput: string
): ValidBlock | ErrorBlock {
  const questions = parseIndexedValues(bodyText, "Question");
  const optionsMap = parseIndexedMap(bodyText, "Options");
  const answers = parseIndexedValues(bodyText, "Answer");

  if (questions.length === 0) {
    return createErrorBlock("No questions found", metadata.id, rawInput);
  }

  const answerMap = new Map(answers.map((entry) => [String(entry.index), entry.value]));
  const items = questions.map((questionEntry) => {
    const key = String(questionEntry.index);
    const options = parseOptions(optionsMap[key] ?? "");
    const answer = parseAnswerValue(answerMap.get(key) ?? "");

    if (options.length === 0 || answer === null) {
      return null;
    }

    return {
      question: questionEntry.value,
      options,
      answer
    };
  });

  if (items.some((item) => item === null)) {
    return createErrorBlock("Invalid multiple_choice structure", metadata.id, rawInput);
  }

  const parsed = multipleChoiceExerciseSchema.safeParse({
    category: "EXERCISE",
    metadata: buildExerciseMetadata(metadata),
    items
  });

  return parsed.success
    ? parsed.data
    : createErrorBlock(parsed.error.issues[0]?.message ?? "Invalid multiple_choice block", metadata.id, rawInput);
}

function buildPairedItems(
  prompts: IndexedEntry[],
  answers: IndexedEntry[],
  blockId: string | undefined,
  promptKey: "question"
): Array<{ question: string; answer: AnswerValue }> | ErrorBlock {
  const answerMap = new Map(answers.map((entry) => [entry.index, entry.value]));
  const items = prompts.map((promptEntry) => {
    const answerValue = answerMap.get(promptEntry.index);

    if (typeof answerValue !== "string") {
      return null;
    }

    return {
      [promptKey]: promptEntry.value,
      answer: parseAnswerValue(answerValue)
    };
  });

  if (items.some((item) => item === null)) {
    return createErrorBlock("Missing answer for question", blockId);
  }

  return items as Array<{ question: string; answer: AnswerValue }>;
}

function parseIndexedValues(bodyText: string, label: string): IndexedEntry[] {
  const regex = new RegExp(
    `\\*\\*${escapeForRegex(label)}\\s+([0-9]+)\\s*:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*(?:Question|Answer|Left|Right|Item|Options|Prompt|Items|Correct Order|Correct Sequence)\\b|$)`,
    "g"
  );

  return Array.from(bodyText.matchAll(regex)).map((match) => ({
    index: Number.parseInt(match[1] ?? "", 10),
    value: cleanupFieldValue(match[2] ?? "")
  }));
}

function parseIndexedMap(bodyText: string, label: string): Record<string, string> {
  const regex = new RegExp(
    `\\*\\*${escapeForRegex(label)}\\s+([0-9]+[a-z]?)\\s*:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*(?:Question|Answer|Left|Right|Item|Options|Prompt|Items|Correct Order|Correct Sequence)\\b|$)`,
    "gi"
  );
  const entries = Array.from(bodyText.matchAll(regex)).map((match) => [
    (match[1] ?? "").toLowerCase(),
    cleanupFieldValue(match[2] ?? "")
  ]);

  return Object.fromEntries(entries);
}

function parseSingleField(bodyText: string, label: string): string | null {
  const regex = new RegExp(
    `\\*\\*${escapeForRegex(label)}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*(?:Question|Answer|Left|Right|Item|Options|Prompt|Items|Correct Order|Correct Sequence)\\b|$)`
  );
  const match = bodyText.match(regex);

  return match ? cleanupFieldValue(match[1] ?? "") : null;
}

function buildExerciseMetadata(metadata: MetadataRecord) {
  return {
    id: metadata.id ?? "",
    type: metadata.type ?? "",
    audio: metadata.audio ?? false,
    audio_track: metadata.audio_track ?? "",
    tags: metadata.tags ?? [],
    instruction: metadata.instruction
  };
}

function parseTags(rawValue: string): string[] {
  const normalized = normalizeString(rawValue);

  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized
      .slice(1, -1)
      .split(",")
      .map((tag) => normalizeString(tag))
      .filter(Boolean);
  }

  return normalized
    .split(",")
    .map((tag) => normalizeString(tag))
    .filter(Boolean);
}

function normalizeBoolean(rawValue: string): boolean {
  return normalizeString(rawValue).toLowerCase() === "true";
}

function normalizeString(rawValue: string): string {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function cleanupFieldValue(value: string): string {
  return value.replace(/\r/g, "").trim();
}

function extractRawContent(bodyText: string): string {
  const rawContentMatch = bodyText.match(/\*\*Raw Content:\*\*\s*([\s\S]*)$/);

  return rawContentMatch ? cleanupFieldValue(rawContentMatch[1]) : cleanupFieldValue(bodyText);
}

function parseAnswerValue(rawValue: string): AnswerValue | null {
  const cleaned = cleanupFieldValue(rawValue);

  if (cleaned === "") {
    return null;
  }

  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
    if (cleaned.startsWith("[ERROR:")) {
      return cleaned;
    }

    const stringArray = parseStringArray(cleaned);
    return stringArray ?? cleaned;
  }

  return cleaned;
}

function parseStringArray(rawValue: string): string[] | null {
  const normalized = cleanupFieldValue(rawValue);

  if (!normalized.startsWith("[") || !normalized.endsWith("]")) {
    return null;
  }

  const inner = normalized.slice(1, -1).trim();

  if (inner === "") {
    return [];
  }

  return splitCommaSeparated(inner).map((item) => normalizeString(item));
}

function parseNumberArray(rawValue: string): number[] | null {
  const normalized = cleanupFieldValue(rawValue);
  const inner =
    normalized.startsWith("[") && normalized.endsWith("]")
      ? normalized.slice(1, -1)
      : normalized;

  const values = splitCommaSeparated(inner)
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((value) => !Number.isNaN(value));

  return values.length > 0 ? values : null;
}

function parseOptions(rawValue: string): string[] {
  const cleaned = cleanupFieldValue(rawValue);
  const optionMatches = Array.from(
    cleaned.matchAll(/([a-z]\)\s*[\s\S]*?)(?=,\s*[a-z]\)\s*|$)/gi)
  ).map((match) => cleanupFieldValue(match[1] ?? ""));

  if (optionMatches.length > 0) {
    return optionMatches;
  }

  return splitCommaSeparated(cleaned)
    .map((option) => cleanupFieldValue(option))
    .filter(Boolean);
}

function splitCommaSeparated(value: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character === '"') {
      inQuotes = !inQuotes;
      current += character;
      continue;
    }

    if (character === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  if (current.trim() !== "") {
    result.push(current.trim());
  }

  return result;
}

function findMatchingLeftKey(
  rightKey: string,
  leftMap: Record<string, string>
): string | null {
  if (rightKey in leftMap) {
    return rightKey;
  }

  const baseKey = rightKey.replace(/[a-z]+$/i, "");

  if (baseKey in leftMap) {
    return baseKey;
  }

  return null;
}

function compareIndexedLabels(left: string, right: string): number {
  const leftMatch = left.match(/^(\d+)([a-z]?)$/i);
  const rightMatch = right.match(/^(\d+)([a-z]?)$/i);

  if (!leftMatch || !rightMatch) {
    return left.localeCompare(right);
  }

  const numericDifference = Number.parseInt(leftMatch[1], 10) - Number.parseInt(rightMatch[1], 10);
  if (numericDifference !== 0) {
    return numericDifference;
  }

  return leftMatch[2].localeCompare(rightMatch[2]);
}

function findDuplicateIdErrors(blocks: Array<ValidBlock | ErrorBlock>): ErrorBlock[] {
  const counts = new Map<string, number>();

  for (const block of blocks) {
    if (isErrorBlock(block) || !hasMetadataId(block)) {
      continue;
    }

    const currentCount = counts.get(block.metadata.id) ?? 0;
    counts.set(block.metadata.id, currentCount + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([blockId]) => createErrorBlock(`Duplicate block ID: ${blockId}`, blockId));
}

function createErrorBlock(
  error: string,
  blockId?: string,
  rawInput?: string
): ErrorBlock {
  return errorBlockSchema.parse({
    error,
    block_id: blockId,
    raw_input: rawInput ? rawInput.trim().slice(0, ERROR_RAW_LIMIT) : undefined
  });
}

function isErrorBlock(block: unknown): block is ErrorBlock {
  return typeof block === "object" && block !== null && "error" in block;
}

function hasMetadataId(block: unknown): block is { metadata: { id: string } } {
  return (
    typeof block === "object" &&
    block !== null &&
    "metadata" in block &&
    typeof (block as { metadata?: { id?: unknown } }).metadata?.id === "string"
  );
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
