import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TagAttributes {
  id: number;
  name: string;
}

interface TagCreationAttributes extends Optional<TagAttributes, "id"> {}

class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  public id!: number;
  public name!: string;

  static initModel(sequelize: Sequelize) {
    Tag.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: "Tag",
        tableName: "tags",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        underscored: true,
      }
    );
  }
}

export default Tag;
