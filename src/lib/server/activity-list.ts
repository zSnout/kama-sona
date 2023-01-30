import type { ActivityCreateInput } from "./activity"

export const activityList: readonly Readonly<
  ActivityCreateInput & { creation: `${number}-${number}-${number}` }
>[] = [
  {
    creation: "2021-01-30",
    title: "Are you a dog person or a cat person?",
    type: "Poll",
    options: ["Dog", "Cat"],
  },
  {
    creation: "2021-01-31",
    title: "What is the best book you have ever read, and why?",
    type: "Poll",
  },
  {
    creation: "2021-02-01",
    title: "How many pets do you have?",
    type: "Poll",
    options: ["None", "1", "2", "3", "4+"],
  },
  {
    creation: "2021-02-02",
    title: "Do you prefer American units or metric ones?",
    type: "Poll",
    options: ["American", "Metric"],
  },
  {
    creation: "2021-02-03",
    title:
      "What is the most beautiful website you've ever seen? Why do you like it?",
    type: "Poll",
  },
]
