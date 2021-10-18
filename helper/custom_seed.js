const Role = require('../modules/v1/user/roleModel')
const User = require('../modules/v1/user/userModel')
const logger = require('./logger');

const seedUtil = {};

// It will add a globalManager default user if not present
seedUtil.addGlobalManager = async () => {
    try {
        const globalManager = await Role.findOne({ role: 'globalManager' });
        if (!globalManager) {
            const user = await new User({ email: "neel@yopmail.com" }).save();
            const userId = user._doc._id;
            await new Role({ role: "globalManager", userId, groupId: null }).save();
            logger.info("Default globalManager has been added");
        } else {
            logger.info('GlobalManager is already present');
        }
        return true;
    } catch (err) {
        logger.error('Error in addGlobalManager', err);
    }
};

seedUtil.addGlobalManager();

module.exports = seedUtil;
