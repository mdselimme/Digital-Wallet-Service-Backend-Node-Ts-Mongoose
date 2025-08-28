/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Model } from "mongoose";





interface ISortOptions {
    field?: string;
    order?: "asc" | "desc";
};

interface IPaginateOptions {
    page?: number;
    limit?: number;
    sort?: ISortOptions;
    startDate?: string;
    endDate?: string;
    filter?: FilterQuery<any>;
    select?: string[] | string,
    remove?: string[] | string,
};

export const QueryBuilder = async <T>(model: Model<T>, options: IPaginateOptions, populateFields: any[] = []
) => {
    const {
        page = 1,
        limit = 10,
        sort = { field: "createdAt", order: "desc" },
        startDate,
        endDate,
        filter = {},
        select,
        remove
    } = options;

    const sortField = sort?.order === "asc" ? 1 : -1;
    const sortOrder: 1 | -1 = sort?.order === "asc" ? 1 : -1;

    const dateFilter: any = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) {
            dateFilter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.createdAt.$lte = end;
        }
    }
    const skip = (page - 1) * limit;
    const query = { ...filter, ...dateFilter };

    let mongooseQuery = model.find(query).sort({ [sortField]: sortOrder });

    if (select) {
        mongooseQuery = mongooseQuery.select(
            Array.isArray(select) ? select.join(" ") : select
        );
    }

    if (remove) {
        mongooseQuery = mongooseQuery.select(
            Array.isArray(remove) ? remove.map((f) => `-${f}`).join(" ") : `-${remove}`
        )
    }

    populateFields.forEach((field) => {
        mongooseQuery = mongooseQuery.populate(field)
    });

    const [data, total] = await Promise.all([
        mongooseQuery.limit(limit).skip(skip),
        model.countDocuments(query),
    ]);

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            sort: { field: sortField, order: sort?.order || "desc" },
        },
        data,
    };

}