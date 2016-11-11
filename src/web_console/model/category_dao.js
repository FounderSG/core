/**
 * Created by strawmanbobi
 * 2015-01-23
 */

// global inclusion
var orm = require('orm');
var dbOrm = require('../mini-poem/db/mysql/mysql_connection').mysqlDB;
var logger = require('../mini-poem/logging/logger4js').helper;
var dateUtils = require('../mini-poem/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Category = dbOrm.define('category',
    {
        id: Number,
        name: String,
        status: Number,
        create_time: String,
        name_en: String,
        name_tw: String,
        protector: String
    },
    {
        cache: false
    }
);

Category.createCategory = function(category, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newCategory = new Category({
        name: category.name,
        status: 1,
        create_time: date,
        name_en: category.name_en,
        name_tw: category.name_tw,
        protector: category.protector
    });
    newCategory.save(function(error, createdCategory) {
        if(error) {
            logger.error('failed to create category : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create category');
            callback(errorCode.SUCCESS, createdCategory);
        }
    });
};

Category.findCategoryByConditions = function(conditions, callback) {
    Category.find(conditions)
        .run(function (error, categories) {
            if (error) {
                logger.error("find category error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find category successfully, length of categories = " + categories.length);
                callback(errorCode.SUCCESS, categories);
            }
        });
};

Category.listCategories = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Category.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (listCategoriesErr, categories) {
                if (listCategoriesErr) {
                    logger.error("list categories error : " + listCategoriesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list categories successfully");
                    callback(errorCode.SUCCESS, categories);
                }
            });
    } else {
        Category.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (listCategoriesErr, categories) {
                if (listCategoriesErr) {
                    logger.error("list categories error : " + listCategoriesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list categories successfully");
                    callback(errorCode.SUCCESS, categories);
                }
            });
    }

};

Category.getCategoryByID = function(categoryID, callback) {
    Category.get(categoryID, function(error, category) {
        if (error) {
            logger.error("get category by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get category by ID successfully");
            callback(errorCode.SUCCESS, category);
        }
    });
};

/* For internal use only */
Category.listRemoteCategories = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Category.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (listCategoriesErr, categories) {
                if (listCategoriesErr) {
                    logger.error("list categories error : " + listCategoriesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list categories successfully");
                    callback(errorCode.SUCCESS, categories);
                }
            });
    } else {
        Category.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (listCategoriesErr, categories) {
                if (listCategoriesErr) {
                    logger.error("list categories error : " + listCategoriesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list categories successfully");
                    callback(errorCode.SUCCESS, categories);
                }
            });
    }

};

module.exports = Category;