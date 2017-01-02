/**
 * Validate permission to invite new user
 */
exports.invitePermission = function(user_role, invite_role) {
  var InvitePermissions = {
    user: ["user"],
    pm: ["user", "fm"],
    pm_admin: ["user", "fm", "pm"],
    admin: ["user", "fm", "pm", "pm_admin", "admin"]
  };

  if ( InvitePermissions[user_role].indexOf(invite_role) == -1) {
    return false;
  }

  return true;
};