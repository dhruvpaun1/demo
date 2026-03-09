import { Router } from "express";
import { createManifest } from "../controllers/createManifestController.js";
import { showAllManifests } from "../controllers/showAllManifests.js";
import { viewManifestPackages } from "../controllers/viewManifestPackages.js";
import { deleteManifestPackagesController } from "../controllers/deleteManifestPackagesController.js";
import { deleteManifestController } from "../controllers/deleteManifestController.js";
import { addPackagesToExistingManifest } from "../controllers/addPackagesToExistingManifest.js";
import { getManifestById } from "../controllers/getManifestById.js";

export const manifestRoute=Router()

manifestRoute.post("/create-manifest",createManifest)
manifestRoute.get("/view-manifests",showAllManifests)
manifestRoute.post("/view-manifest",getManifestById)
manifestRoute.get("/view-manifest/:manifestId",viewManifestPackages)
manifestRoute.delete("/delete-manifest-packages",deleteManifestPackagesController)
manifestRoute.delete("/delete-manifest",deleteManifestController)
manifestRoute.put("/edit-manifest",addPackagesToExistingManifest)