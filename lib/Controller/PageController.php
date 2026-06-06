<?php

namespace OCA\Opensidian\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;
use OCP\Util;

class PageController extends Controller {
    public function __construct(string $appName, IRequest $request) {
        parent::__construct($appName, $request);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index(): TemplateResponse {
        Util::addScript('opensidian', 'dist/opensidian');
        Util::addStyle('opensidian', 'style');

        return new TemplateResponse('opensidian', 'main');
    }
}
