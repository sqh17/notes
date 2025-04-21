/**
 * 动态获取本地的ip
 * @returns string
 */
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

/**
 * 动态返回反向代理的配置
 * @param {*} config 
 * @returns 
 */
function buildNginxConfig(config) {
    var cwd = process.cwd().replace(/\\/g, '/') + '/app';
    var protocol = /https|443/.test(config.ip) ? 'https' : 'http';
    var servers = [{
        browserIp: 'localhost',
        port: 80,
        root: cwd,
        serverIp: config.ip,
        protocol: protocol
    },
    {
        browserIp: getIPAdress(),
        port: 8080,
        root: cwd,
        serverIp: config.ip,
        protocol: protocol
    }
]
.map(function (item) {
    return `
        server {
            listen  ${item.port};
            server_name  ${item.browserIp};
            location =/ {
                add_header X-Frame-Options SAMEORIGIN;
                root        ${item.root};
                index index.html;
            }
            location ~* \\.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css|swf|woff|woff2|ttf|json|svg|cur|vue|otf|eot)$ {
                charset     utf-8;
                root        ${item.root};
                expires     3d;
            }
            location = /socket/v2 {
                proxy_pass   ${item.protocol}://${item.serverIp};
                proxy_redirect off;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host ${item.serverIp};
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header REMOTE-HOST $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_connect_timeout 30;
                proxy_send_timeout 30;
                proxy_read_timeout 60;
                proxy_buffer_size 256k;
                proxy_buffers 4 256k;
            }
            #设置手机的访问，手机链的wifi和电脑同一个ip
            location / {
                proxy_pass   ${item.protocol}://${item.serverIp};
                #携带cookie 1
                proxy_set_header Cookie $http_cookie;
                #设置cookie 的 domain 2
                proxy_cookie_domain ${item.serverIp} ${item.browserIp};
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                #设置真实的host 3（1，2，3顺序不能倒）
                proxy_set_header Host ${item.serverIp};
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header REMOTE-HOST $remote_addr;
            }
        }
    `;
    }).join('\n');
    var str = `
        worker_processes  1;
        events {
            worker_connections  1024;
        }
        http {
            include       mime.types;
            default_type  application/octet-stream;
            sendfile      on;
            keepalive_timeout 10;
            ${servers}
        }
    `;
    return str;
}
exports = module.exports = buildNginxConfig;