import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface CertificateAttributes {
  id: number;
  userId: number;
  courseId: string;
  tokenId?: string;
  studentName: string;
  courseName: string;
  tokenURI?: string;
  ipfsHash?: string;
  minted: boolean;
  mintedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateCreationAttributes extends Optional<CertificateAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Certificate extends Model<CertificateAttributes, CertificateCreationAttributes> implements CertificateAttributes {
  public id!: number;
  public userId!: number;
  public courseId!: string;
  public tokenId?: string;
  public studentName!: string;
  public courseName!: string;
  public tokenURI?: string;
  public ipfsHash?: string;
  public minted!: boolean;
  public mintedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Certificate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    },
    tokenId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    studentName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    tokenURI: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipfsHash: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    minted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mintedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Certificate",
    tableName: "certificates",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"],
      },
    ],
  }
);
