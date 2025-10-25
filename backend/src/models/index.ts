import { User } from "./User";
import { Course } from "./Course";
import { UserProgress } from "./UserProgress";
import { Certificate } from "./Certificate";

// Define associations
User.hasMany(UserProgress, { foreignKey: "userId", as: "progress" });
UserProgress.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Certificate, { foreignKey: "userId", as: "certificates" });
Certificate.belongsTo(User, { foreignKey: "userId", as: "user" });

Course.hasMany(UserProgress, { foreignKey: "courseId", as: "progress" });
UserProgress.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(Certificate, { foreignKey: "courseId", as: "certificates" });
Certificate.belongsTo(Course, { foreignKey: "courseId", as: "course" });

export { User, Course, UserProgress, Certificate };
