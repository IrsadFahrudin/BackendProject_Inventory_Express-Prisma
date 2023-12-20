module.exports = {
    apps: [
        {
            name: "myapp",
            script: "./bin/www",
            watch: true,
            exec_mode: "cluster",
            instance: "max",
        }
    ]
}