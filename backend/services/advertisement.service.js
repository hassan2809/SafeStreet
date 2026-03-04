import Advertisement from "../models/advertisement.model.js";

// ✅ Get all active advertisements
export const getActiveAdvertisements = async () => {
  try {
    const currentDate = new Date();
    return await Advertisement.find({
      active: true,
      expiryDate: { $gte: currentDate },
    });
  } catch (error) {
    throw new Error("Error fetching advertisements");
  }
};

// ✅ Create a new advertisement
export const createAdvertisement = async (data) => {
  try {
    return await Advertisement.create(data);
  } catch (error) {
    throw new Error("Error creating advertisement");
  }
};

// ✅ Update an advertisement
export const updateAdvertisement = async (id, data) => {
  try {
    return await Advertisement.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Error updating advertisement");
  }
};

// ✅ Delete an advertisement
export const deleteAdvertisement = async (id) => {
  try {
    return await Advertisement.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting advertisement");
  }
};
