import { Button, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGlobalStore, useUserStore } from "@/store/module";
import * as api from "@/helpers/api";
import { absolutifyLink } from "@/helpers/utils";
import useLoading from "@/hooks/useLoading";
import Icon from "@/components/Icon";
import AppearanceSelect from "@/components/AppearanceSelect";
import LocaleSelect from "@/components/LocaleSelect";

const Auth = () => {
  const { t } = useTranslation();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const actionBtnLoadingState = useLoading(false);
  const { appearance, locale, systemStatus } = globalStore.state;
  const mode = systemStatus.profile.mode;
  const [username, setUsername] = useState(mode === "demo" ? "mahoo12138@qq.com" : "");
  const [password, setPassword] = useState(mode === "demo" ? "password" : "");

  const [identityProviderList] = useState<IdentityProvider[]>([]);

  useEffect(() => {
    console.log("Auth Page Mounted✔");
    userStore.doSignOut().catch();
    // const fetchIdentityProviderList = async () => {
    //   const {
    //     data: { data: identityProviderList },
    //   } = await api.getIdentityProviderList();
    //   setIdentityProviderList(identityProviderList);
    // };
    // fetchIdentityProviderList();
  }, []);

  const handleUsernameInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setUsername(text);
  };

  const handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setPassword(text);
  };

  const handleLocaleSelectChange = (locale: Locale) => {
    globalStore.setLocale(locale);
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    globalStore.setAppearance(appearance);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (systemStatus?.host) {
      handleSignInBtnClick();
    } else {
      handleSignUpBtnsClick();
    }
  };

  const handleSignInBtnClick = async () => {
    if (username === "" || password === "") {
      return;
    }

    if (actionBtnLoadingState.isLoading) {
      return;
    }

    try {
      actionBtnLoadingState.setLoading();
      const res = await api.signin(username, password);
      console.log(res, "res");
      const user = await userStore.doSignIn(res.data.data.user.openId);
      if (user) {
        window.location.href = "/";
      } else {
        toast.error(t("message.login-failed"));
      }
    } catch (error: any) {
      console.error(error, "error");
      toast.error(error.response.data.message || t("message.login-failed"));
    }
    actionBtnLoadingState.setFinish();
  };

  const handleSignUpBtnsClick = async () => {
    if (username === "" || password === "") {
      return;
    }

    if (actionBtnLoadingState.isLoading) {
      return;
    }

    try {
      actionBtnLoadingState.setLoading();
      const res = await api.signup(username, password);
      const user = await userStore.doSignIn(res.data.data.user.openId);
      if (user) {
        window.location.href = "/";
      } else {
        toast.error(t("common.signup-failed"));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message || error.message || t("common.signup-failed"));
    }
    actionBtnLoadingState.setFinish();
  };

  const handleSignInWithIdentityProvider = async (identityProvider: IdentityProvider) => {
    const stateQueryParameter = `auth.signin.${identityProvider.name}-${identityProvider.id}`;
    if (identityProvider.type === "OAUTH2") {
      const redirectUri = absolutifyLink("/auth/callback");
      const oauth2Config = identityProvider.config.oauth2Config;
      const authUrl = `${oauth2Config.authUrl}?client_id=${
        oauth2Config.clientId
      }&redirect_uri=${redirectUri}&state=${stateQueryParameter}&response_type=code&scope=${encodeURIComponent(
        oauth2Config.scopes.join(" ")
      )}`;
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex flex-row items-center justify-center w-full h-full dark:bg-zinc-800">
      <div className="flex flex-col items-center justify-start h-full max-w-full py-4 w-80">
        <div className="flex flex-col items-center justify-center w-full py-4 grow">
          <div className="flex flex-col items-start justify-start w-full mb-4">
            <div className="flex flex-row items-center justify-start w-full mb-2">
              <img className="w-auto h-12 mr-1 rounded-lg" src={systemStatus.customizedProfile.logoUrl} alt="" />
              <p className="text-6xl tracking-wide text-black opacity-80 dark:text-gray-200">{systemStatus.customizedProfile.name}</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {systemStatus.customizedProfile.description || t("common.memos-slogan")}
            </p>
          </div>
          <form className="w-full" onSubmit={handleFormSubmit}>
            <div className={`flex flex-col justify-start items-start w-full ${actionBtnLoadingState.isLoading && "opacity-80"}`}>
              <div className="relative flex flex-col items-start justify-start w-full py-2 mt-2 text-base">
                <span
                  className={`absolute top-3 left-3 px-1 leading-10 flex-shrink-0 text-base cursor-text text-gray-400 transition-all select-none pointer-events-none ${
                    username ? "!text-sm !top-0 !z-10 !leading-4 bg-white dark:bg-zinc-800 rounded" : ""
                  }`}
                >
                  {t("common.username")}
                </span>
                <input
                  className="w-full px-3 py-3 text-base rounded-lg input-text dark:bg-zinc-800"
                  type="text"
                  value={username}
                  onChange={handleUsernameInputChanged}
                  required
                />
              </div>
              <div className="relative flex flex-col items-start justify-start w-full py-2 mt-2 text-base">
                <span
                  className={`absolute top-3 left-3 px-1 leading-10 flex-shrink-0 text-base cursor-text text-gray-400 transition-all select-none pointer-events-none ${
                    password ? "!text-sm !top-0 !z-10 !leading-4 bg-white dark:bg-zinc-800 rounded" : ""
                  }`}
                >
                  {t("common.password")}
                </span>
                <input
                  className="w-full px-3 py-3 text-base rounded-lg input-text dark:bg-zinc-800"
                  type="password"
                  value={password}
                  onChange={handlePasswordInputChanged}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-end w-full mt-2">
              {systemStatus?.host ? (
                <>
                  {actionBtnLoadingState.isLoading && <Icon.Loader className="w-4 h-auto mr-2 animate-spin dark:text-gray-300" />}
                  {systemStatus?.allowSignUp && (
                    <>
                      <button
                        type="button"
                        className={`btn-text ${actionBtnLoadingState.isLoading ? "cursor-wait opacity-80" : ""}`}
                        onClick={handleSignUpBtnsClick}
                      >
                        {t("common.sign-up")}
                      </button>
                      <span className="mr-2 font-mono text-gray-200">/</span>
                    </>
                  )}
                  <button
                    type="submit"
                    className={`btn-primary ${actionBtnLoadingState.isLoading ? "cursor-wait opacity-80" : ""}`}
                    onClick={handleSignInBtnClick}
                  >
                    {t("common.sign-in")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className={`btn-primary ${actionBtnLoadingState.isLoading ? "cursor-wait opacity-80" : ""}`}
                    onClick={handleSignUpBtnsClick}
                  >
                    {t("auth.signup-as-host")}
                  </button>
                </>
              )}
            </div>
          </form>
          {identityProviderList.length > 0 && (
            <>
              <Divider className="!my-4">{t("common.or")}</Divider>
              <div className="flex flex-col w-full space-y-2">
                {identityProviderList.map((identityProvider) => (
                  <Button
                    key={identityProvider.id}
                    variant="outlined"
                    color="neutral"
                    className="w-full"
                    size="md"
                    onClick={() => handleSignInWithIdentityProvider(identityProvider)}
                  >
                    {t("common.sign-in-with", { provider: identityProvider.name })}
                  </Button>
                ))}
              </div>
            </>
          )}
          {!systemStatus?.host && (
            <p className="inline-block float-right w-full mt-4 text-sm text-right text-gray-500 whitespace-pre-wrap">
              {t("auth.host-tip")}
            </p>
          )}
        </div>
        <div className="flex flex-row items-center justify-center w-full gap-2">
          <LocaleSelect value={locale} onChange={handleLocaleSelectChange} />
          <AppearanceSelect value={appearance} onChange={handleAppearanceSelectChange} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
