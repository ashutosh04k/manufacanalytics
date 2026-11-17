import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Group justify="flex-end">
      <ActionIcon
        onClick={toggleColorScheme}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
        title="Toggle color scheme"
      >
        {computedColorScheme === 'dark' ? '☀️' : '🌙'}
      </ActionIcon>
    </Group>
  );
}
