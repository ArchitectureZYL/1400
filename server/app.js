var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const UserRouter = require('./routes/UserRouter');
const JWT = require('./utils/JWT');
const ProductRouter = require('./routes/ProductRouter');
// 引入模块时使用的变量名是 categoryRouter
const CategoryRouter = require('./routes/CategoryRoutes.js');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 定义 JWT 验证中间件
const jwtMiddleware = (req, res, next) => {
  // 定义不需要认证的路由
  const unprotectedRoutes = ["/api/user/login"];
  if (unprotectedRoutes.includes(req.url)) {
    next();
    return;
  }

  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send({
      errCode: "-1",
      errorInfo: "未提供 token"
    });
  }

  var payload = JWT.verify(token);
  if (payload) {
    const newToken = JWT.generate({
      _id: payload._id,
      username: payload.username
    }, "1d");
    res.header("Authorization", newToken);
    next();
  } else {
    res.status(401).send({
      errCode: "-1",
      errorInfo: "token 过期或无效"
    });
  }
};

// 使用 JWT 验证中间件
app.use(jwtMiddleware);

// 路由配置
app.use(UserRouter);
app.use(ProductRouter);
// 使用时将变量名改成和引入时一致
app.use(CategoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // 返回 JSON 格式的错误信息
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;