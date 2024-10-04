import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.config";
import { getCurrentDateTimeUTC } from "../../utils/datetime.util";

export class Users extends Model {
    public user_id!: string;
    public username!: string;
    public full_name!: string;
    public email!: string;
    public gender!: string;
    public date_of_birth!: Date;
    public bio!: string;
    public preferences!: string;
    public profile_photo!: string;
    public created_on!: Date;
    public deactivated_on!: Date;
    public last_updated_on!: Date;
    public is_active!: boolean;
}

Users.init(
    {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        preferences: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profile_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_on: {
            type: DataTypes.DATE,
            defaultValue: getCurrentDateTimeUTC(),
            allowNull: false,
        },
        deactivated_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        last_updated_on: {
            type: DataTypes.DATE,
            defaultValue: getCurrentDateTimeUTC(),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
        modelName: "User",
        timestamps: false,
    }
);

export default Users;
