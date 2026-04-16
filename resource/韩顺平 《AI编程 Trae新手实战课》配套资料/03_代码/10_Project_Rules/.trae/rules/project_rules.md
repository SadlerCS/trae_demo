- 本项目是一个基于 Spring Boot 3.2 的 RESTful 后端服务。
- 包结构遵循：  
  com.example.myapp  
  ├── controller  
  ├── service  
  ├── repository  
  ├── model  
  ├── dto  
  └── config
- Controller 层只负责 HTTP 映射和参数校验，不包含业务逻辑。
- 所有请求/响应使用 DTO（Data Transfer Object），禁止直接暴露 Entity。
- 数据库使用 MySQL 8.0 或更高版本，实体类放在 model 包，使用 Jakarta Persistence 注解。
- 全局异常处理通过 @ControllerAdvice 实现。
- 使用 Jakarta Validation（如 @NotBlank, @NotNull）进行参数校验。
- 配置文件使用 application.yml，敏感信息通过环境变量注入。
- 构建工具为 Maven，依赖统一管理在 dependencyManagement 中。