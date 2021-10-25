const Role = require('../modules/v1/user/roleModel');
const User = require('../modules/v1/user/userModel');
const mongoose = require('mongoose');
const logger = require('./logger');

const seedUtil = {};

// It will add a globalManager default user if not present
seedUtil.addGlobalManager = async () => {
    try {
        const globalManagerEmail = process.env.globalManagerEmail || "neel@yopmail.com";
        const globalManager = await Role.findOne({ role: 'globalManager' });
        let globalManagerRoleId = null;
        if (!globalManager) {
            const role = await new Role({ role: "globalManager", groupId: null }).save();
            globalManagerRoleId = role._doc._id;
        } else {
            globalManagerRoleId = globalManager._id;
        }
        const globalManagerUser = await User.findOne({ email: globalManagerEmail });
        if (globalManagerUser) {
            const userRole = await User.findOne({ email: globalManagerEmail, "roles.roleId": mongoose.Types.ObjectId(globalManagerRoleId) });
            if (userRole) {
                logger.info('GlobalManager is already present');
            } else {
                await User.update({ email: globalManagerEmail }, { $push: { roles: { roleId: mongoose.Types.ObjectId(globalManagerRoleId) } } });
                logger.info("Default globalManager role has been modified");
            }
        } else {
            await new User({
                email: globalManagerEmail,
                password: '$2b$10$v7JbklXLiZzGM3nhyYp9TOmvgsj/U/xSCSa5.fEVGqAem63I5egIG', // "Test.123"
                roles: [{ roleId: mongoose.Types.ObjectId(globalManagerRoleId) }]
            }).save();
            logger.info("Default globalManager has been added");
        }
        return true;
    } catch (err) {
        logger.error('Error in addGlobalManager', err);
    }
};

seedUtil.addGlobalManager();

module.exports = seedUtil;
