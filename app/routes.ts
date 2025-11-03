import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/add-item' , 'routes/add-item.tsx'),
    route('/edit-item/:id' , 'routes/edit-item.tsx'),
    route('/entry/:id' , 'routes/entry.tsx'),
    route('/transactions' , 'routes/transactions.tsx'),
    route('/item/:id' , 'routes/view-item.tsx'),
] satisfies RouteConfig;

