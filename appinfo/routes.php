<?php
return [
    'routes' => [
        ['name' => 'page#index',        'url' => '/',                       'verb' => 'GET'],
        ['name' => 'api#listFiles',     'url' => '/api/v1/files',           'verb' => 'GET'],
        ['name' => 'api#readFile',      'url' => '/api/v1/file',            'verb' => 'GET'],
        ['name' => 'api#writeFile',     'url' => '/api/v1/file',            'verb' => 'POST'],
        ['name' => 'api#deleteFile',    'url' => '/api/v1/file',            'verb' => 'DELETE'],
        ['name' => 'api#renameFile',    'url' => '/api/v1/file/rename',     'verb' => 'PUT'],
        ['name' => 'api#createDir',     'url' => '/api/v1/directory',       'verb' => 'POST'],
        ['name' => 'api#getSettings',   'url' => '/api/v1/settings',        'verb' => 'GET'],
        ['name' => 'api#saveSettings',  'url' => '/api/v1/settings',        'verb' => 'POST'],
        ['name' => 'api#proxyLlm',      'url' => '/api/v1/llmproxy',        'verb' => 'POST'],
    ]
];
