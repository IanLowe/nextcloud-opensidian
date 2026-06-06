<?php

namespace OCA\Opensidian\Service;

use OCP\IConfig;
use OCP\IUserSession;

class SettingsService {
    private const APP_ID = 'opensidian';

    private IConfig $config;
    private IUserSession $userSession;

    public function __construct(IConfig $config, IUserSession $userSession) {
        $this->config = $config;
        $this->userSession = $userSession;
    }

    private function getUserId(): string {
        $user = $this->userSession->getUser();
        if ($user === null) {
            throw new \RuntimeException('Not authenticated');
        }
        return $user->getUID();
    }

    public function getVaultPath(): string {
        return $this->config->getUserValue($this->getUserId(), self::APP_ID, 'vaultPath', '');
    }

    public function setVaultPath(string $path): void {
        $this->config->setUserValue($this->getUserId(), self::APP_ID, 'vaultPath', $path);
    }

    /** Returns LLM settings (no token — token stays in browser localStorage). */
    public function getLlmSettings(): array {
        $raw = $this->config->getUserValue($this->getUserId(), self::APP_ID, 'llmSettings', '{}');
        $data = json_decode($raw, true) ?? [];
        return [
            'url'          => $data['url'] ?? '',
            'model'        => $data['model'] ?? '',
            'systemPrompt' => $data['systemPrompt'] ?? '',
            'userPrompt'   => $data['userPrompt'] ?? '',
        ];
    }

    public function setLlmSettings(array $settings): void {
        // Never persist the token server-side
        unset($settings['token']);
        $this->config->setUserValue(
            $this->getUserId(),
            self::APP_ID,
            'llmSettings',
            json_encode($settings)
        );
    }

    public function getAll(): array {
        return [
            'vaultPath'   => $this->getVaultPath(),
            'llmSettings' => $this->getLlmSettings(),
        ];
    }
}
