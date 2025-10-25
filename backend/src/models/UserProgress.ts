import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface UserProgressAttributes {
  id: number;
  userId: number;
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  totalProgress: number;
  completed: boolean;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressCreationAttributes extends Optional<UserProgressAttributes, "id" | "createdAt" | "updatedAt"> {}

export class UserProgress extends Model<UserProgressAttributes, UserProgressCreationAttributes> implements UserProgressAttributes {
  public id!: number;
  public userId!: number;
  public courseId!: string;
  public completedLessons!: string[];
  public quizScores!: Record<string, number>;
  public totalProgress!: number;
  public completed!: boolean;
  public completionDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserProgress.init(
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
    completedLessons: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    quizScores: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    totalProgress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completionDate: {
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
    modelName: "UserProgress",
    tableName: "user_progress",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"],
      },
    ],
  }
);
