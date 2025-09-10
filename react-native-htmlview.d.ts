declare module "react-native-htmlview" {
  import React from "react";
  import { TextStyle, ViewStyle } from "react-native";

  export interface HTMLViewProps {
    value: string;
    stylesheet?: { [key: string]: TextStyle | ViewStyle };
    addLineBreaks?: boolean;
    paragraphBreak?: string;
    onLinkPress?: (url: string) => void;
    onError?: (error: Error) => void;
    bullet?: string;
    lineBreak?: string;
    NodeComponent?: React.ComponentType<any>;
    TextComponent?: React.ComponentType<any>;
    RootComponent?: React.ComponentType<any>;
    renderNode?: (
      node: any,
      index: number,
      siblings: any,
      parent: any,
      defaultRenderer: (node: any, parent: any) => React.ReactNode
    ) => React.ReactNode;
  }

  // 👇 instead of class, declare it as a function component
  const HTMLView: React.FC<HTMLViewProps>;
  export default HTMLView;
}
