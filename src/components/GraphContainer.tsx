import { useEffect, useState, type FC } from "react";
import { View, Text } from "react-native";
import { Bar, CartesianChart, Line } from "victory-native";
import { matchFont, useFont } from "@shopify/react-native-skia";
import { listFontFamilies } from "@shopify/react-native-skia";
import { Platform } from "react-native";

interface IGraphContainerProps {}

type Slant = "normal" | "italic" | "oblique";
type Weight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
interface RNFontStyle {
  fontFamily: string;
  fontSize: number;
  fontStyle: Slant;
  fontWeight: Weight;
}

export const GraphContainer: FC<IGraphContainerProps> = () => {
  const fontFamily = Platform.select({
    android: "verdana",
    default: "serif",
    ios: "Helvetica",
  });
  const fontStyle: Partial<RNFontStyle> = {
    fontFamily,
    fontSize: 14,
    fontWeight: "bold",
  };

  const font = matchFont(fontStyle);
  const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
  }));

  return (
    <View style={{ height: 500, padding: 10 }}>
      <View style={{ marginTop: 10, height: "50%" }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          // 👇 pass the font, opting in to axes.
          axisOptions={{ font }}
        >
          {({ points }) => (
            <Line points={points.highTmp} color="orange" strokeWidth={3} />
          )}
        </CartesianChart>
      </View>

      <View style={{ marginTop: 40, height: "50%" }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          axisOptions={{ font }}
        >
          {({ points, chartBounds }) => (
            //👇 pass a PointsArray to the Bar component, as well as options.
            <Bar
              points={points.highTmp}
              chartBounds={chartBounds}
              color="orange"
              roundedCorners={{ topLeft: 10, topRight: 10 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
};
