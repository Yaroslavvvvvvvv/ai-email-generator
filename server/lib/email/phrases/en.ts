import type { LocalePhrases } from './types'

export const en: LocalePhrases = {
  formal: {
    subject: 'Regarding: {topic}',
    greeting: ['Dear Sir or Madam,', 'Dear colleagues,'],
    opener: [
      'I am writing to you regarding the following: {topic}.',
      'I would like to bring the following matter to your attention: {topic}.',
      'Please allow me to raise the following point: {topic}.',
    ],
    body: [
      'The matter has been open for some time now, and a resolution would be appreciated by everyone involved.',
      'I have reviewed the relevant details on my side and believe the next step rests with your team.',
      'Should any documentation be required from me, I will provide it without delay.',
      'I trust this falls within your remit; if it does not, I would be grateful if you could forward it to the right person.',
      'I remain available should you need any clarification before proceeding.',
    ],
    cta: [
      'I would be grateful for your written confirmation by the end of this week.',
      'Please let me know what timeline I may expect.',
      'Kindly advise on how you would prefer to proceed.',
    ],
    signoff: ['Yours sincerely,', 'Kind regards,'],
  },
  friendly: {
    subject: 'Quick note: {topic}',
    greeting: ['Hi there,', 'Hey,'],
    opener: [
      'Hope you are doing well! I wanted to reach out about this: {topic}.',
      'Quick note from me — here is what it is about: {topic}.',
      'I have been meaning to write to you about this: {topic}.',
    ],
    body: [
      'Nothing urgent, but it has been on my mind and I would rather mention it than sit on it.',
      'I know things get busy on your end, so no pressure on the timing.',
      'If it is easier to talk it through, I am happy to jump on a quick call instead.',
      'Let me know if I am missing context — entirely possible.',
      'Either way, I would rather hear a plain no than wonder about it.',
    ],
    cta: [
      'Could you let me know what you think when you get a moment?',
      'Just drop me a line either way — it helps me plan.',
      'Would this week work for a short chat?',
    ],
    signoff: ['Thanks so much,', 'Cheers,'],
  },
  persuasive: {
    subject: '{topic} — worth five minutes',
    greeting: ['Hello,', 'Hi,'],
    opener: [
      'I am reaching out about the following: {topic}. I think it matters more than it looks at first.',
      'There is a straightforward win available here: {topic}.',
      'I want to make a short case for the following: {topic}.',
    ],
    body: [
      'Acting on it now costs very little; leaving it costs more with every week that passes.',
      'The upside is concrete and lands with your side, not only mine.',
      'I have already handled the parts I can handle, so what remains is a single decision.',
      'Everyone who has looked at it so far reached the same conclusion.',
      'If there is a reason not to, I would genuinely like to hear it — it would save us both time.',
    ],
    cta: [
      'Can we agree on the next step this week?',
      'Give me fifteen minutes and I will show you the numbers.',
      'If you say yes, I can have it moving by tomorrow.',
    ],
    signoff: ['Looking forward to it,', 'Best,'],
  },
  direct: {
    subject: '{topic}',
    greeting: ['Hello,', 'Hi,'],
    opener: [
      'Straight to it: {topic}.',
      'Short message: {topic}.',
      'I need to settle this: {topic}.',
    ],
    body: [
      'It has been open longer than it should be.',
      'I have done my part; the next move is yours.',
      'I am not asking for a long answer, just a clear one.',
      'If the answer is no, that is fine — I just need to know.',
    ],
    cta: [
      'Please reply by Friday.',
      'Tell me the date I can count on.',
      'A yes or a no is enough.',
    ],
    signoff: ['Thanks,', 'Regards,'],
  },
}
