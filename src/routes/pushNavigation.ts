import { createNavigationContainerRef } from "@react-navigation/native"
import RootNavigationStackModel from "./model/routes_model"

const navigationRef = createNavigationContainerRef<RootNavigationStackModel>();

const navigate = (name: any, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export { navigationRef };
export default navigate;