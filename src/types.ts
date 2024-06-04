export type UploadAPIReqPayload = {
  name: string;
  size: number;
  type: string;
};

export type UploadAPIRespData = {
  success: {
    _id: string;
    name: string;
    size: number;
    type: string;
    key: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  };
  error: string;
};
