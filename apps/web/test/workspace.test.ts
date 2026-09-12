import { expect, it } from 'vitest';
import { iconCatalog } from '@colorful-icon/react/catalog';
import { iconLoaders } from '../src/lib/icon-loaders';
it('can load every public catalog icon through the package boundary', async () => {
  expect(Object.keys(iconLoaders).sort()).toEqual(iconCatalog.map(i=>i.component).sort());
  for (const name of ['Story','ArrowRight','X','OpenAiLogo','OriginalClubArmchair','OriginalMountainRange','OriginalTwistingTower']) {
    const loaded = await iconLoaders[name]();
    expect(loaded[`${name}Icon`],name).toBeTruthy();
  }
});
