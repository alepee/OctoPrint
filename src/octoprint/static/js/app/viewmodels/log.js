$(function() {
    function LogViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.access = parameters[1];

        // initialize list helper
        self.listHelper = new ItemListHelper(
            "logFiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "modification": function(a, b) {
                    // sorts descending
                    if (a["date"] > b["date"]) return -1;
                    if (a["date"] < b["date"]) return 1;
                    return 0;
                },
                "size": function(a, b) {
                    // sorts descending
                    if (a["size"] > b["size"]) return -1;
                    if (a["size"] < b["size"]) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            CONFIG_LOGFILESPERPAGE
        );

        self.requestData = function() {
            if (!self.loginState.hasPermission(self.access.permissions.LOGS))
                return;

            OctoPrint.logs.list()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            var files = response.files;
            if (files === undefined)
                return;

            self.listHelper.updateItems(files);
        };

        self.removeFile = function(filename) {
            if (!self.loginState.hasPermission(self.access.permissions.LOGS))
                return;

            OctoPrint.logs.delete(filename)
                .done(self.requestData);
        };

        self.onSettingsShown = function() {
            self.requestData();
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: LogViewModel,
        dependencies: ["loginStateViewModel", "accessViewModel"],
        elements: ["#logs"]
    });
});
