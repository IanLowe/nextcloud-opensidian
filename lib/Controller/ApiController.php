<?php

namespace OCA\Opensidian\Controller;

use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http;
use OCP\Files\NotFoundException;
use OCP\Http\Client\IClientService;
use OCA\Opensidian\Service\VaultService;
use OCA\Opensidian\Service\SettingsService;

class ApiController extends Controller {
    private VaultService $vaultService;
    private SettingsService $settingsService;
    private IClientService $httpClient;

    public function __construct(
        string $appName,
        IRequest $request,
        VaultService $vaultService,
        SettingsService $settingsService,
        IClientService $httpClient
    ) {
        parent::__construct($appName, $request);
        $this->vaultService   = $vaultService;
        $this->settingsService = $settingsService;
        $this->httpClient      = $httpClient;
    }

    // ── Files ────────────────────────────────────────────────────────────────

    /**
     * @NoAdminRequired
     */
    public function listFiles(): DataResponse {
        $path = $this->request->getParam('path', '');
        if ($path === '') {
            return new DataResponse(['error' => 'Missing path'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $files = $this->vaultService->listFiles($path);
            return new DataResponse($files);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function readFile(): DataResponse {
        $path = $this->request->getParam('path', '');
        if ($path === '') {
            return new DataResponse(['error' => 'Missing path'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $content = $this->vaultService->readFile($path);
            return new DataResponse(['content' => $content]);
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'Not found'], Http::STATUS_NOT_FOUND);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function writeFile(): DataResponse {
        // Nextcloud parses application/json bodies — use getParam() not php://input
        $path    = $this->request->getParam('path', '');
        $content = $this->request->getParam('content', '');
        if ($path === '') {
            return new DataResponse(['error' => 'Missing path'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $this->vaultService->writeFile($path, $content);
            return new DataResponse(['ok' => true]);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function deleteFile(): DataResponse {
        $path = $this->request->getParam('path', '');
        if ($path === '') {
            return new DataResponse(['error' => 'Missing path'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $this->vaultService->deleteFile($path);
            return new DataResponse(['ok' => true]);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function renameFile(): DataResponse {
        $path    = $this->request->getParam('path', '');
        $newPath = $this->request->getParam('newPath', '');
        if ($path === '' || $newPath === '') {
            return new DataResponse(['error' => 'Missing path or newPath'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $this->vaultService->renameFile($path, $newPath);
            return new DataResponse(['ok' => true]);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function createDir(): DataResponse {
        $path = $this->request->getParam('path', '');
        if ($path === '') {
            return new DataResponse(['error' => 'Missing path'], Http::STATUS_BAD_REQUEST);
        }
        try {
            $this->vaultService->createDirectory($path);
            return new DataResponse(['ok' => true]);
        } catch (\InvalidArgumentException $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    // ── LLM Proxy ────────────────────────────────────────────────────────────

    /**
     * @NoAdminRequired
     */
    public function proxyLlm(): DataResponse {
        $url      = $this->request->getParam('url', '');
        $model    = $this->request->getParam('model', '');
        $token    = $this->request->getParam('token', '');
        $messages = $this->request->getParam('messages', []);

        if (!$url || !$model || !preg_match('#^https?://#i', $url)) {
            return new DataResponse(['error' => 'Missing or invalid url/model'], Http::STATUS_BAD_REQUEST);
        }

        $headers = ['Content-Type' => 'application/json'];
        if ($token) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        try {
            $client   = $this->httpClient->newClient();
            $response = $client->post($url, [
                'headers' => $headers,
                'body'    => json_encode([
                    'model'    => $model,
                    'messages' => $messages,
                    'stream'   => false,
                ]),
                'timeout' => 60,
                'verify'  => false,
            ]);
            $data = json_decode($response->getBody(), true);
            return new DataResponse($data ?? []);
        } catch (\Exception $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    // ── Settings ─────────────────────────────────────────────────────────────

    /**
     * @NoAdminRequired
     */
    public function getSettings(): DataResponse {
        try {
            return new DataResponse($this->settingsService->getAll());
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function saveSettings(): DataResponse {
        // Nextcloud automatically parses application/json bodies into request params
        $vaultPath   = $this->request->getParam('vaultPath');
        $llmSettings = $this->request->getParam('llmSettings');

        try {
            if ($vaultPath !== null) {
                $this->settingsService->setVaultPath((string) $vaultPath);
            }
            if (is_array($llmSettings)) {
                $this->settingsService->setLlmSettings($llmSettings);
            }
            return new DataResponse(['ok' => true]);
        } catch (\Throwable $e) {
            return new DataResponse(['error' => $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }
}
