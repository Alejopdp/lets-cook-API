require("dotenv").config();
// Infra
import "./infraestructure/http/app";
// import "./infraestructure/sequelize" hooks
import "./infraestructure/mongoose";
require("source-map-support").install();

// Subdomains
// import "./bounded_contexts/IAM"
