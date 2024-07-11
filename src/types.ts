export type PostAPIReqPayload = {
  name: string;
  size: number;
  type: string;
};

export type PostAPIRespData = {
  success: {
    id: string;
    name: string;
    size: number;
    type: string;
    key: string;
    expiresAt: Date;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  };
  error: string;
};

export type GetAPIRespData = Pick<PostAPIRespData, 'success'>;
