import type { ActivityCreateInput } from "./activity"

export const activityList: readonly Readonly<ActivityCreateInput>[] = [
  {
    creation: "2023-01-25",
    title: "Do you like chocolate or vanilla ice cream more?",
    options: ["Chocolate", "Vanilla"],
    type: "Poll",
  },
  {
    creation: "2023-01-26",
    title: "What is your favorite breakfast food, and why?",
    type: "Poll",
  },
  {
    creation: "2023-01-27",
    title: "Which school management system is the best?",
    type: "Poll",
    options: ["Blackbaud", "Google Classroom", "Schoology"],
  },
  {
    creation: "2023-01-28",
    title: "What is your opinion on activities?",
    type: "Poll",
    options: [
      "Very positive",
      "Positive",
      "Neutral",
      "Dislike",
      "Intense hatred",
    ],
  },
]
