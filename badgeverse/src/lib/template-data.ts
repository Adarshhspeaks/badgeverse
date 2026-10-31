import type { Template, CardElement } from './types';
import rawTemplates from './templates.json';

// Replace __PLACEHOLDER_AVATAR__ with the real placeholder path
function processElements(elements: CardElement[]): CardElement[] {
  return elements.map((el) => {
    if (el.type === 'img' && el.src === '__PLACEHOLDER_AVATAR__') {
      return { ...el, src: '/placeholder-avatar.svg' };
    }
    return el;
  });
}

function processTemplate(t: Record<string, unknown>): Template {
  const template = t as unknown as Template;
  return {
    ...template,
    front: processElements(template.front),
    back: processElements(template.back),
  };
}

export const templates: Template[] = (rawTemplates as Record<string, unknown>[]).map(processTemplate);

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'All') return templates;
  return templates.filter((t) => t.cat === category);
}

export function filterTemplates(query: string, category: string, tier: string): Template[] {
  return templates.filter((t) => {
    const matchCat = category === 'All' || t.cat === category;
    const matchTier = tier === 'All' || t.tier === tier;
    const matchQuery =
      !query ||
      (t.name + ' ' + t.cat).toLowerCase().includes(query.toLowerCase());
    return matchCat && matchTier && matchQuery;
  });
}

