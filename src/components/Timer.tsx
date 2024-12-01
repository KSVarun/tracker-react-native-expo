import { useState, type FC } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import { List } from "react-native-paper";
import { getTimeToRenderFromMilliSeconds } from "../utils/timer";
import { addSeconds } from "date-fns";

interface ITimerProps {}

const data = [
  {
    id: "123",
    name: "bath",
    steps: [
      { name: "wash clothes", time: 180000 },
      { name: "wet body", time: 90000 },
      { name: "head shampoo", time: 90000 },
      { name: "body wash soap", time: 120000 },
      { name: "soak", time: 180000 },
      { name: "head wash", time: 120000 },
      { name: "body wash", time: 120000 },
      { name: "face wash", time: 180000 },
      { name: "cloths final wash", time: 180000 },
    ],
    totalTime: 1260000,
  },
  {
    id: "124",
    name: "water plants",
    steps: [
      { name: "water first floor plants", time: 180000 },
      { name: "water second floor plants", time: 180000 },
    ],
    totalTime: 360000,
  },
  {
    id: "125",
    name: "test",
    steps: [
      { name: "test1", time: 5000 },
      { name: "test2", time: 5000 },
    ],
    totalTime: 10000,
  },
];

interface ILocalState {
  expandedAccordionId: string | null;
}

export const Timer: FC<ITimerProps> = () => {
  const [localState, setLocalState] = useState<ILocalState>({
    expandedAccordionId: null,
  });

  function wait(milliSeconds: number, task: string) {
    return new Promise((res) => {
      setTimeout(() => {
        res(task);
      }, milliSeconds);
    });
  }

  async function handleAccordionPress(id: string) {
    // if (id === localState.expandedAccordionId) {
    //   return;
    // }
    // await Notifications.cancelAllScheduledNotificationsAsync();
    setLocalState((state) => ({ ...state, expandedAccordionId: id }));
    const task = data.find((d) => d.id === id);

    for (let i = 0; i < task.steps.length; i++) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: `${task.steps[i].name} timer completed`,
        },
        trigger: addSeconds(
          new Date(),
          i === 0
            ? task.steps[i].time / 1000
            : (task.steps[i].time + task.steps[i - 1].time) / 1000
        ),
      });
    }
  }

  return (
    <View>
      <Text>Timer</Text>
      <List.AccordionGroup
        expandedId={localState.expandedAccordionId}
        onAccordionPress={handleAccordionPress}
      >
        {data.map((d) => {
          const time = getTimeToRenderFromMilliSeconds(d.totalTime);
          return (
            <List.Accordion title={`${d.name} - ${time}`} id={d.id} key={d.id}>
              {d.steps.map((item) => {
                const time = getTimeToRenderFromMilliSeconds(item.time);
                return (
                  <List.Item title={`${item.name}-${time}`} key={item.name} />
                );
              })}
            </List.Accordion>
          );
        })}
      </List.AccordionGroup>

      <Button
        title="trigger"
        onPress={() => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Reminder!",
              body: "This is your local notification.",
            },
            trigger: null,
          });
        }}
      />
    </View>
  );
};
