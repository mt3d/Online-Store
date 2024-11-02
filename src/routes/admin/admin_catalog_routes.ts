import { Router } from "express";
import { CategoryModel, ProductModel, SupplierModel } from "../../data/orm/models";

export const createAdminCatalogRoutes = (router: Router) => {
    router.get("/table", async (req, res) => {
        const products = await ProductModel.findAll({
            include: [
                { model: SupplierModel, as: "supplier" },
                { model: CategoryModel, as: "category" }
            ],
            raw: true,
            nest: true
        });

        res.render("admin/product_table", { products });
    });

    router.delete("/:id", async (req, res) => {
        const id = req.params.id;
        const count = await ProductModel.destroy({ where: { id }});

        if (count === 1) {
            res.end();
        } else {
            throw Error(`Unexpected deletion count result: ${count}`);
        }
    })
}