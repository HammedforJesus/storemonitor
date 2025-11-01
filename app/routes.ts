import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/add-item' , 'routes/add-item.tsx')
] satisfies RouteConfig;

