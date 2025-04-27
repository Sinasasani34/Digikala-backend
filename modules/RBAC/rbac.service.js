const createHttpError = require("http-errors");
const { Role, Permission, RolePermission } = require("./rbac.model");
const { Op } = require("sequelize");

async function createRoleHandler(req, res, next) {
    try {
        const { title, description } = req.body;
        const existRole = await Role.findOne({ where: { title } });
        if (existRole) createHttpError(409, "Already exist role title");
        await Role.create({
            title,
            description
        })
        return res.json({
            message: "role created successfully"
        })
    } catch (error) {
        next(error)
    }
}
async function createPermissionHandler(req, res, next) {
    try {
        const { title, description } = req.body;
        const existPermission = await Permission.findOne({ where: { title } });
        if (existPermission) createHttpError(409, "Already exist role title");
        await Permission.create({
            title,
            description
        })
        return res.json({
            message: "Permission created successfully"
        })
    } catch (error) {
        next(error)
    }
}
async function assignPermissionToRoleHandler(req, res, next) {
    try {
        let { roleId, permissions = [] } = req.body;
        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) throw createHttpError(404, "Not found role");
        if (permissions?.length > 0) {
            const permisionCount = await Permission.count({ where: { id: { [Op.in]: permissions } } });
            if (permisionCount !== permissions.length) {
                throw createHttpError(400, "send correct list of permissions");
            }

            const permissionList = permissions.map(per => ({
                roleId,
                permissionId: per
            }))
            await RolePermission.bulkCreate(permissionList);
        }
        return res.json({
            message: "assigned permissions to role"
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createRoleHandler,
    createPermissionHandler,
    assignPermissionToRoleHandler
}