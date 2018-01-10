var EmployeeSql = {
    insert:'insert into employees ' +
    '(' +
    'employee_name,' +
    'password,' +
    'age,' +
    'email,' +
    'home_address,' +
    'phone_no1,' +
    'phone_no2,' +
    'rzrq,' +
    'lzrq' +
    ') ' +
    'values(?,?,?,?,?,?,?,?,?)',
    queryAll:'select * from employee',
    getUserById:'select * from employee where _id = ? '
};
module.exports = EmployeeSql;
