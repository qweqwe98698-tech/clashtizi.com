/**
 * Utility to extract FAQ items from markdown content and generate Schema.org FAQPage JSON-LD.
 */

export interface FaqItem {
	question: string;
	answer: string;
}

export function extractFaqItems(markdown: string): FaqItem[] {
	if (!markdown) return [];

	const faqItems: FaqItem[] = [];
	// Regex matches: ### Q1：... or ### Q: ... or ### 问：...
	const qMatches = [
		...markdown.matchAll(
			/###\s*(?:Q\d*[:：]|问[:：]|常见问题[:：]?)\s*([^\r\n]+)\r?\n([\s\S]*?)(?=###|##|$)/gi,
		),
	];

	for (const m of qMatches) {
		const question = m[1].trim().replace(/^\*\*|\*\*$/g, "");
		let answerText = m[2].trim();
		// Strip leading **答**：
		answerText = answerText.replace(/^\s*\*\*答\*\*[:：]\s*/, "");
		// Remove markdown formatting
		const plainAnswer = answerText
			.replace(/`([^`]+)`/g, "$1")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\s+/g, " ")
			.trim();

		if (question.length > 3 && plainAnswer.length > 10) {
			faqItems.push({
				question,
				answer: plainAnswer.slice(0, 300),
			});
		}
	}

	return faqItems.slice(0, 6); // Max 6 items for clean SERP representation
}

export function generateFaqSchema(markdown: string) {
	const items = extractFaqItems(markdown);
	if (items.length < 2) return null;

	return {
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};
}
