import "./index.css";
import { Composition } from "remotion";
import { GoldRateReel, defaultProps } from "./GoldRateReel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GoldRateReel"
      component={GoldRateReel}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  );
};
