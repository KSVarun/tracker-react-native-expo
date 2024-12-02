import { useState, type FC } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import { List } from "react-native-paper";
import { getTimeToRenderFromMilliSeconds } from "../utils/timer";
import { addMilliseconds } from "date-fns";
// import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
// import {
//   addNotificationReceivedListener,
//   addNotificationResponseReceivedListener,
//   getLastNotificationResponseAsync,
//   removeNotificationSubscription,
//   unregisterForNotificationsAsync,
// } from "expo-notifications";

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
      { name: "water first floor plants", time: 60000 },
      { name: "water second floor plants", time: 60000 },
    ],
    totalTime: 120000,
  },
  {
    id: "125",
    name: "test",
    steps: [
      { name: "test1", time: 10000 },
      { name: "test2", time: 15000 },
    ],
    totalTime: 11000,
  },
];

interface ILocalState {
  expandedAccordionId: string | null;
}
function wait(milliSeconds: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(new Date());
    }, milliSeconds);
  });
}

export const Timer: FC<ITimerProps> = () => {
  const [localState, setLocalState] = useState<ILocalState>({
    expandedAccordionId: null,
  });
  // const responseListener = useRef<Notifications.EventSubscription>();

  // useEffect(() => {
  //   responseListener.current = addNotificationReceivedListener(
  //     (notification) => {
  //       console.log("notification", new Date(notification.date));
  //     }
  //   );
  //   return () => {
  //     removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // if (id === localState.expandedAccordionId) {
  //   return;
  // }
  // await Notifications.cancelAllScheduledNotificationsAsync();
  async function handleAccordionPress(id: string) {
    setLocalState((state) => ({ ...state, expandedAccordionId: id }));
    const task = data.find((d) => d.id === id);
    let cumulativeTime = 0;
    for (let i = 0; i < task.steps.length; i++) {
      // console.log("current", new Date());

      cumulativeTime += task.steps[i].time;
      // console.log("scheduled", addMilliseconds(new Date(), cumulativeTime));

      Notifications.scheduleNotificationAsync({
        content: {
          title: `${task.steps[i].name} timer completed`,
        },
        trigger: addMilliseconds(new Date(), cumulativeTime),
      });
    }
    // const res = await Notifications.getAllScheduledNotificationsAsync();
    // console.log(
    //   res.map((r) => ({
    //     //@ts-ignore
    //     date: new Date(r.trigger.value),
    //     name: r.content.title,
    //   }))
    // );
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
