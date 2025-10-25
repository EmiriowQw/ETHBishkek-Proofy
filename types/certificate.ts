export interface Certificate {
  tokenId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: Date;
  tokenURI: string;
}

export interface CertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  external_url: string;
}
