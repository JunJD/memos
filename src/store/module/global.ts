import * as api from "@/helpers/api";
import storage from "@/helpers/storage";
import i18n from "@/i18n";
import { findNearestLanguageMatch } from "@/utils/i18n";
import store, { useAppSelector } from "../";
import { setAppearance, setGlobalState, setLocale } from "../reducer/global";

export const initialGlobalState = async () => {
  const defaultGlobalState = {
    locale: "zh-Hans" as Locale,
    appearance: "system" as Appearance,
    systemStatus: {
      allowSignUp: false,
      ignoreUpgrade: false,
      disablePublicMemos: false,
      maxUploadSizeMiB: 0,
      additionalStyle: "",
      additionalScript: "",
      customizedProfile: {
        name: "memos",
        logoUrl: "/logo.webp",
        description: "",
        locale: "zh-Hans",
        appearance: "system",
        externalUrl: "",
      },
    } as SystemStatus,
  };

  const { locale: storageLocale, appearance: storageAppearance } = storage.get(["locale", "appearance"]);
  if (storageLocale) {
    defaultGlobalState.locale = storageLocale;
  }
  if (storageAppearance) {
    defaultGlobalState.appearance = storageAppearance;
  }

  const { data } = (await api.getSystemStatus()).data;
  console.log("data", data);
  if (data) {
    const customizedProfile = data.profile;
    console.log("初始化的状态0==>✨✨✨", defaultGlobalState, customizedProfile);
    defaultGlobalState.systemStatus = {
      ...data,
      customizedProfile: {
        name: "memos",
        logoUrl: "/logo.webp",
        description: "",
        locale: "zh-Hans",
        appearance: "system",
        externalUrl: "",
      },
    };
    console.log("初始化的状态1==>✨✨✨", defaultGlobalState);
    defaultGlobalState.locale = storageLocale || findNearestLanguageMatch(i18n.language);
    defaultGlobalState.appearance = "system";
  }
  console.log("初始化的状态==>✨✨✨", defaultGlobalState);
  store.dispatch(setGlobalState(defaultGlobalState));
};

export const useGlobalStore = () => {
  const state = useAppSelector((state) => state.global);

  return {
    state,
    getState: () => {
      return store.getState().global;
    },
    isDev: () => {
      return state.systemStatus.profile.mode !== "prod";
    },
    fetchSystemStatus: async () => {
      const { data: systemStatus } = (await api.getSystemStatus()).data;
      store.dispatch(setGlobalState({ systemStatus: systemStatus }));
      return systemStatus;
    },
    setSystemStatus: (systemStatus: Partial<SystemStatus>) => {
      store.dispatch(
        setGlobalState({
          systemStatus: {
            ...state.systemStatus,
            ...systemStatus,
          },
        })
      );
    },
    setLocale: (locale: Locale) => {
      store.dispatch(setLocale(locale));
    },
    setAppearance: (appearance: Appearance) => {
      store.dispatch(setAppearance(appearance));
    },
  };
};
