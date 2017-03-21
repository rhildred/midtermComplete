angular.module('starter.services', [])

    .factory('Expenses', function () {
        // Might use a resource here that returns a JSON array

        // Database Initialization
        var dbSize = 5 * 1024 * 1024; // 5MB
        var webdb = {};
        webdb.db = openDatabase("Expenses", "1", "Todo manager", dbSize);
        webdb.onError = function (tx, e) {
            alert("There has been an error: " + e.message);
        }
        webdb.onSuccess = function (tx, e) {
            alert("amount added");
        }
        var db = webdb.db;
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                "expenses(id integer primary key autoincrement, amount NUMERIC, category TEXT, added_on DATETIME, finished_on DATETIME)", []);
        });

        return {
            all: function (callback) {
                var db = webdb.db;
                var expenses = [];
                db.transaction(function (tx) {
                    tx.executeSql("SELECT * FROM expenses ORDER BY added_on", [], (tx, rs) => {
                        for (var i = 0; i < rs.rows.length; i++) {
                            expenses.push({
                                id: rs.rows.item(i).id,
                                amount: rs.rows.item(i).amount,
                                category: rs.rows.item(i).category,
                                start: rs.rows.item(i).added_on,
                                finished: rs.rows.item(i).finished_on
                            });

                        }
                        callback(tx, null, expenses);
                    }, callback);
                });

            },
            categories: function (callback) {
                 var db = webdb.db;
                var categories = [];
                db.transaction(function (tx) {
                    tx.executeSql("SELECT category, SUM(amount) AS count FROM expenses GROUP BY category ORDER BY category", [], (tx, rs) => {
                        for (var i = 0; i < rs.rows.length; i++) {
                            categories.push({
                                category: rs.rows.item(i).category,
                                count: rs.rows.item(i).count
                            });

                        }
                        callback(tx, null, categories);
                    }, callback);
                });
           },
            add: function (amount, category) {
                var db = webdb.db;
                db.transaction(function (tx) {
                    var addedOn = new Date();
                    tx.executeSql("INSERT INTO expenses(amount, category) VALUES (?,?)",
                        [amount, category],
                        webdb.onSuccess,
                        webdb.onError);
                });

            }
        };
    });
