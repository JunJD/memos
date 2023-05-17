import axios from "axios";
import store from "../store";

type ResponseObject<T> = {
  data: T;
  error?: string;
  message?: string;
};

const memosReq = axios.create({
  baseURL: "http://127.0.0.1:9090",
});

memosReq.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    OPENID: store.getState().user.user?.openId ?? "",
  };
  return config;
});

export function getSystemStatus() {
  return memosReq.get<ResponseObject<SystemStatus>>("/api/status");
}

export function getSystemSetting() {
  return memosReq.get<ResponseObject<SystemSetting[]>>("/api/system/setting");
}

export function upsertSystemSetting(systemSetting: SystemSetting) {
  return memosReq.post<ResponseObject<SystemSetting>>("/api/system/setting", systemSetting);
}

export function vacuumDatabase() {
  return memosReq.post("/api/system/vacuum");
}

export function signin(username: string, password: string) {
  return memosReq.post<ResponseObject<{ user: User }>>("/api/auth/signin", {
    email: username,
    password,
  });
}

export function signinWithSSO(identityProviderId: IdentityProviderId, code: string, redirectUri: string) {
  return memosReq.post<ResponseObject<User>>("/api/auth/signin/sso", {
    identityProviderId,
    code,
    redirectUri,
  });
}

export function signup(username: string, password: string) {
  return memosReq.post<ResponseObject<{ user: User }>>("/api/auth/signup", {
    email: username,
    password,
  });
}

export function signout() {
  return memosReq.post("/api/auth/signout");
}

export function createUser(userCreate: UserCreate) {
  return memosReq.post<ResponseObject<User>>("/api/user", userCreate);
}

export function getMyselfUser(openId: string) {
  console.log("getMyselfUser", openId);
  return memosReq.get<ResponseObject<User>>("/api/user/me?openId=" + openId);
}

export function getUserList() {
  return memosReq.get<ResponseObject<User[]>>("/api/user");
}

export function getUserById(id: number) {
  return memosReq.get<ResponseObject<User>>(`/api/user/${id}`);
}

export function upsertUserSetting(upsert: UserSettingUpsert) {
  return memosReq.post<ResponseObject<UserSetting>>(`/api/user/setting`, upsert);
}

export function patchUser(userPatch: UserPatch) {
  return memosReq.patch<ResponseObject<User>>(`/api/user/${userPatch.id}`, userPatch);
}

export function deleteUser(userDelete: UserDelete) {
  return memosReq.delete(`/api/user/${userDelete.id}`);
}

export function getAllMemos(memoFind?: MemoFind) {
  const queryList = [];
  if (memoFind?.offset) {
    queryList.push(`offset=${memoFind.offset}`);
  }
  if (memoFind?.limit) {
    queryList.push(`limit=${memoFind.limit}`);
  }

  return memosReq.get<ResponseObject<Memo[]>>(`/api/memo/all?${queryList.join("&")}`);
}

export function getMemoList(memoFind?: MemoFind) {
  const queryList = [];
  if (memoFind?.creatorId) {
    queryList.push(`creatorId=${memoFind.creatorId}`);
  }
  if (memoFind?.rowStatus) {
    queryList.push(`rowStatus=${memoFind.rowStatus}`);
  }
  if (memoFind?.pinned) {
    queryList.push(`pinned=${memoFind.pinned}`);
  }
  if (memoFind?.offset) {
    queryList.push(`offset=${memoFind.offset}`);
  }
  if (memoFind?.limit) {
    queryList.push(`limit=${memoFind.limit}`);
  }
  return memosReq.get<ResponseObject<Memo[]>>(`/api/memo?${queryList.join("&")}`);
}

export function getMemoStats(userId: UserId) {
  console.log("getMemoStats", userId);
  return memosReq.get<ResponseObject<number[]>>(`/api/memo`);
}

export function getMemoById(id: MemoId) {
  return memosReq.get<ResponseObject<Memo>>(`/api/memo/${id}`);
}

export function createMemo(memoCreate: MemoCreate) {
  return memosReq.post<ResponseObject<Memo>>("/api/memo", memoCreate);
}

export function patchMemo(memoPatch: MemoPatch) {
  return memosReq.patch<ResponseObject<Memo>>(`/api/memo/${memoPatch.id}`, memoPatch);
}

export function pinMemo(memoId: MemoId) {
  return memosReq.post(`/api/memo/${memoId}/organizer`, {
    pinned: true,
  });
}

export function unpinMemo(memoId: MemoId) {
  return memosReq.post(`/api/memo/${memoId}/organizer`, {
    pinned: false,
  });
}

export function deleteMemo(memoId: MemoId) {
  return memosReq.delete(`/api/memo/${memoId}`);
}

export function getShortcutList(shortcutFind?: ShortcutFind) {
  const queryList = [];
  if (shortcutFind?.creatorId) {
    queryList.push(`creatorId=${shortcutFind.creatorId}`);
  }
  return memosReq.get<ResponseObject<Shortcut[]>>(`/api/shortcut?${queryList.join("&")}`);
}

export function createShortcut(shortcutCreate: ShortcutCreate) {
  return memosReq.post<ResponseObject<Shortcut>>("/api/shortcut", shortcutCreate);
}

export function patchShortcut(shortcutPatch: ShortcutPatch) {
  return memosReq.patch<ResponseObject<Shortcut>>(`/api/shortcut/${shortcutPatch.id}`, shortcutPatch);
}

export function deleteShortcutById(shortcutId: ShortcutId) {
  return memosReq.delete(`/api/shortcut/${shortcutId}`);
}

export function getResourceList() {
  return memosReq.get<ResponseObject<Resource[]>>("/api/resource");
}

export function getResourceListWithLimit(resourceFind?: ResourceFind) {
  const queryList = [];
  if (resourceFind?.offset) {
    queryList.push(`offset=${resourceFind.offset}`);
  }
  if (resourceFind?.limit) {
    queryList.push(`limit=${resourceFind.limit}`);
  }
  return memosReq.get<ResponseObject<Resource[]>>(`/api/resource?${queryList.join("&")}`);
}

export function createResource(resourceCreate: ResourceCreate) {
  return memosReq.post<ResponseObject<Resource>>("/api/resource", resourceCreate);
}

export function createResourceWithBlob(formData: FormData) {
  return memosReq.post<ResponseObject<Resource>>("/api/resource/blob", formData);
}

export function deleteResourceById(id: ResourceId) {
  return memosReq.delete(`/api/resource/${id}`);
}

export function patchResource(resourcePatch: ResourcePatch) {
  return memosReq.patch<ResponseObject<Resource>>(`/api/resource/${resourcePatch.id}`, resourcePatch);
}

export function getMemoResourceList(memoId: MemoId) {
  return memosReq.get<ResponseObject<Resource[]>>(`/api/memo/${memoId}/resource`);
}

export function upsertMemoResource(memoId: MemoId, resourceId: ResourceId) {
  return memosReq.post<ResponseObject<Resource>>(`/api/memo/${memoId}/resource`, {
    resourceId,
  });
}

export function deleteMemoResource(memoId: MemoId, resourceId: ResourceId) {
  return memosReq.delete(`/api/memo/${memoId}/resource/${resourceId}`);
}

export function getTagList(tagFind?: TagFind) {
  const queryList = [];
  if (tagFind?.creatorId) {
    queryList.push(`creatorId=${tagFind.creatorId}`);
  }
  return memosReq.get<ResponseObject<string[]>>(`/api/tag?${queryList.join("&")}`);
}

export function getTagSuggestionList() {
  return memosReq.get<ResponseObject<string[]>>(`/api/tag/suggestion`);
}

export function upsertTag(tagName: string) {
  return memosReq.post<ResponseObject<string>>(`/api/tag`, {
    name: tagName,
  });
}

export function deleteTag(tagName: string) {
  return memosReq.post<ResponseObject<boolean>>(`/api/tag/delete`, {
    name: tagName,
  });
}

export function getStorageList() {
  return memosReq.get<ResponseObject<ObjectStorage[]>>(`/api/storage`);
}

export function createStorage(storageCreate: StorageCreate) {
  return memosReq.post<ResponseObject<ObjectStorage>>(`/api/storage`, storageCreate);
}

export function patchStorage(storagePatch: StoragePatch) {
  return memosReq.patch<ResponseObject<ObjectStorage>>(`/api/storage/${storagePatch.id}`, storagePatch);
}

export function deleteStorage(storageId: StorageId) {
  return memosReq.delete(`/api/storage/${storageId}`);
}

export function getIdentityProviderList() {
  return memosReq.get<ResponseObject<IdentityProvider[]>>(`/api/idp`);
}

export function createIdentityProvider(identityProviderCreate: IdentityProviderCreate) {
  return memosReq.post<ResponseObject<IdentityProvider>>(`/api/idp`, identityProviderCreate);
}

export function patchIdentityProvider(identityProviderPatch: IdentityProviderPatch) {
  return memosReq.patch<ResponseObject<IdentityProvider>>(`/api/idp/${identityProviderPatch.id}`, identityProviderPatch);
}

export function deleteIdentityProvider(id: IdentityProviderId) {
  return memosReq.delete(`/api/idp/${id}`);
}

export function postChatCompletion(messages: any[]) {
  return memosReq.post<ResponseObject<string>>(`/api/openai/chat-completion`, messages);
}

export function checkOpenAIEnabled() {
  return memosReq.get<ResponseObject<boolean>>(`/api/openai/enabled`);
}

export async function getRepoStarCount() {
  const { data } = await memosReq.get(`https://api.github.com/repos/usememos/memos`, {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: "",
    },
  });
  return data.stargazers_count as number;
}

export async function getRepoLatestTag() {
  const { data } = await memosReq.get(`https://api.github.com/repos/usememos/memos/tags`, {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: "",
    },
  });
  return data[0].name as string;
}
