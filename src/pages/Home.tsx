import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGlobalStore, useUserStore } from "@/store/module";
import MemoEditor from "@/components/MemoEditor";
import MemoFilter from "@/components/MemoFilter";
import MemoList from "@/components/MemoList";
import MobileHeader from "@/components/MobileHeader";
import HomeSidebar from "@/components/HomeSidebar";

function Home() {
  const { t } = useTranslation();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const user = userStore.state.user;

  useEffect(() => {
    const currentUserId = userStore.getCurrentUserId();
    userStore.getUserById(currentUserId).then((user) => {
      if (!user) {
        toast.error(t("message.user-not-found"));
        return;
      }
    });
  }, [userStore.getCurrentUserId()]);

  useEffect(() => {
    if (user?.setting.locale) {
      globalStore.setLocale(user.setting.locale);
    }
  }, [user?.setting.locale]);

  return (
    <div className="flex flex-row items-start justify-start w-full">
      <div className="flex-grow w-auto max-w-2xl px-4 sm:px-2 sm:pt-4">
        <MobileHeader />
        <div className="flex flex-col items-start justify-start w-full h-auto rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {!userStore.isVisitorMode() && <MemoEditor />}
          <MemoFilter />
        </div>
        <MemoList />
      </div>
      <HomeSidebar />
    </div>
  );
}

export default Home;
