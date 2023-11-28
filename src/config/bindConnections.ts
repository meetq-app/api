import Country from "../models/country";
import State from "../models/state";
import City from "../models/city";
import User from "../models/user";
import Place from "../models/place";
import PlaceGallery from "../models/place_gallery";
import PlaceRating from "../models/place_rating";

export default ()=>{
  Country.hasMany(State, { foreignKey: "countryId" });
  State.belongsTo(Country, { foreignKey: "countryId" });

  State.hasMany(City, { foreignKey: "stateId" });
  City.belongsTo(State, { foreignKey: "stateId" });

  City.hasMany(User, { foreignKey: "cityId" });
  User.belongsTo(City, { foreignKey: "cityId" });
  User.hasMany(PlaceRating, { foreignKey: "userId" });

  Place.belongsTo(User, { foreignKey: "userId" });
  Place.belongsTo(City, { foreignKey: "cityId" });

  Place.hasMany(PlaceGallery, { foreignKey: "placeId" });
  Place.hasMany(PlaceRating, { foreignKey: "placeId" });

  PlaceGallery.belongsTo(Place, { foreignKey: "placeId" });

  PlaceRating.belongsTo(Place, {foreignKey: "placeId"});
  PlaceRating.belongsTo(User, {foreignKey: "userId"});
}