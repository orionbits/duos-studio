import type {
  BaseMetadata,
  ClassificationExercise,
  ErrorBlock as ErrorBlockData,
  FillBlankExercise,
  FillBlankGrouped,
  LongFormExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  OrderingExercise,
  RolePlayExercise,
  ShortAnswerExercise,
  TrueFalseExercise,
  VerbConjugationExercise
} from "@/lib/schemas";

export interface ExerciseProps<T> {
  id: string;
  metadata: Pick<BaseMetadata, "audio" | "audio_track" | "tags"> & {
    type: string;
    instruction?: string;
  };
  data: T;
  onAnswerChange?: (answers: Record<string, unknown>) => void;
  showFeedback?: boolean;
}

export type ShortAnswerData = ShortAnswerExercise["items"];
export type FillBlankSimpleData = Extract<FillBlankExercise, { items: unknown }>["items"];
export type FillBlankGroupedData = Pick<
  FillBlankGrouped,
  "base_text" | "blanks" | "original_sentence"
>;
export type MultipleChoiceData = MultipleChoiceExercise["items"];
export type MatchingData = MatchingExercise["items"];
export type TrueFalseData = TrueFalseExercise["items"];
export type VerbConjugationData = VerbConjugationExercise["items"];
export type OrderingData = Pick<OrderingExercise, "items" | "correct_order">;
export type ClassificationData = ClassificationExercise["items"];
export type LongFormData = Pick<LongFormExercise, "prompt" | "answer">;
export type RolePlayData = Pick<RolePlayExercise, "prompt" | "answer">;
export type ErrorBlockProps = {
  data: ErrorBlockData;
};
