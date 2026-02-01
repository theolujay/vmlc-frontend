export const BroadcastUrls = {
  get_broadcast_list: '/v1/broadcasts/',
  create_broadcast: '/v1/broadcasts/',
  get_broadcast_detail: (id: number) => `/v1/broadcasts/${id}/`,
};
