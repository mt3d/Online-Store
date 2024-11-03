import { Router } from "express";
import { CategoryModel, ProductModel, SupplierModel } from "../../data/orm/models";
import { getData, isValid, ProductDTOValidator } from "../../data/validation";

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
    });

    // Respond with a populated HTML form.
    router.get("/edit/:id", async (req, res) => {
        const id = req.params.id;
        const data = {
            product: {
                id: { value: id },
                ...await ProductDTOValidator.validate(await ProductModel.findByPk(id, { raw: true }))
            },
            suppliers: await SupplierModel.findAll({ raw: true }),
            categories: await CategoryModel.findAll({ raw: true })
        };

        res.render("admin/product_editor", data);
    });

    // Validate the edited data and store it.
    router.put("/:id", async (req, res) => {
        const validation = await ProductDTOValidator.validate(req.body);

        if (isValid(validation)) {
            await ProductModel.update(getData(validation), { where: { id: req.params.id }});
            res.redirect(303, "/api/products/table");
        } else {
            res.render("admin/product_editor", {
                product: { id: { value: req.params.id }, ...validation },
                suppliers: await SupplierModel.findAll({ raw: true }),
                categories: await CategoryModel.findAll({ raw: true })
            });
        }
    });

    // Start the creation process.
    router.get("/create", async (req, res) => {
        const data = {
            product: {},
            suppliers: await SupplierModel.findAll({ raw: true }),
            categories: await CategoryModel.findAll({ raw: true }),
            create: true
        };

        res.render("admin/product_editor", data);
    });

    router.post("/create", async (req, res) => {
        const validation = await ProductDTOValidator.validate(req.body);

        if (isValid(validation)) {
            await ProductModel.create(getData(validation));
            res.redirect(303, "/api/products/table");
        } else {
            res.render("admin/product_editor", {
                product: validation,
                suppliers: await SupplierModel.findAll({ raw: true }),
                categories: await CategoryModel.findAll({ raw: true }),
                create: true
            });
        }
    });
}