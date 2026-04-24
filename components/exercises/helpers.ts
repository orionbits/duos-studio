export function getAnswerPreview(answer: string | string[]) {
  return Array.isArray(answer) ? answer.join(" / ") : answer;
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function isCorrectStringAnswer(
  userAnswer: string,
  correctAnswer: string | string[]
) {
  const normalizedUserAnswer = normalizeText(userAnswer);

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(
      (candidate) => normalizeText(candidate) === normalizedUserAnswer
    );
  }

  return normalizeText(correctAnswer) === normalizedUserAnswer;
}

export function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
