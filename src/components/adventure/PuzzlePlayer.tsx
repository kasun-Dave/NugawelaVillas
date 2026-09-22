import { useState } from 'react';
import type { AdventureStage } from '@/types/adventure';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface PuzzlePlayerProps {
  stage: AdventureStage;
  onSubmit: (answer: string | number | number[]) => Promise<{ correct: boolean; message?: string }>;
  onRequestHint: (level: number) => Promise<string | null>;
  disabled?: boolean;
}

export function PuzzlePlayer({ stage, onSubmit, onRequestHint, disabled }: PuzzlePlayerProps) {
  const [answer, setAnswer] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedPin, setSelectedPin] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [sequence, setSequence] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);

  const puzzle = stage.puzzle;
  const config = puzzle.config;

  const handleHint = async (level: number) => {
    const text = await onRequestHint(level);
    if (text) setRevealedHints((prev) => [...prev, text]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback('');
    try {
      let submitAnswer: string | number | number[] = answer;
      if (config.type === 'multiple_choice') submitAnswer = selectedIndex ?? -1;
      if (config.type === 'map_pin') submitAnswer = selectedPin;
      if (config.type === 'symbol') submitAnswer = selectedSymbol;
      if (config.type === 'sequence') submitAnswer = sequence;

      const result = await onSubmit(submitAnswer);
      setFeedback(result.message ?? (result.correct ? 'Correct!' : 'Try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSequenceItem = (index: number) => {
    if (sequence.includes(index)) {
      setSequence(sequence.filter((i) => i !== index));
    } else {
      setSequence([...sequence, index]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-mist/50 p-4">
        <p className="mb-1 text-sm font-medium text-charcoal">Your challenge</p>
        <p className="text-body">{puzzle.prompt}</p>
      </div>

      {config.type === 'multiple_choice' ? (
        <div className="space-y-2">
          {config.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'w-full rounded-xl border p-3 text-left text-sm transition-colors',
                selectedIndex === i
                  ? 'border-forest bg-forest-50'
                  : 'border-mist-200 hover:border-forest-200',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null}

      {config.type === 'map_pin' ? (
        <div className="space-y-2">
          {config.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedPin(opt.id)}
              className={cn(
                'w-full rounded-xl border p-3 text-left text-sm',
                selectedPin === opt.id ? 'border-forest bg-forest-50' : 'border-mist-200',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}

      {config.type === 'symbol' ? (
        <div className="flex flex-wrap gap-3">
          {config.symbols.map((sym) => (
            <button
              key={sym}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedSymbol(sym)}
              className={cn(
                'h-14 w-14 rounded-xl border text-2xl transition-colors',
                selectedSymbol === sym ? 'border-forest bg-forest-50' : 'border-mist-200',
              )}
            >
              {sym}
            </button>
          ))}
        </div>
      ) : null}

      {config.type === 'sequence' ? (
        <div className="space-y-3">
          <p className="text-sm text-charcoal-500">Tap items in order:</p>
          <div className="flex flex-wrap gap-2">
            {config.items.map((item, i) => (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() => toggleSequenceItem(i)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  sequence.includes(i) ? 'border-forest bg-forest text-ivory' : 'border-mist-200',
                )}
              >
                {sequence.includes(i) ? `${sequence.indexOf(i) + 1}. ` : ''}
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {['keyword', 'riddle', 'cipher', 'staff_checkpoint', 'observation'].includes(config.type) ? (
        <Input
          label="Your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={config.type === 'cipher' ? 'Deciphered word...' : 'Type your answer...'}
        />
      ) : null}

      {config.type === 'cipher' ? (
        <p className="rounded-xl bg-mist/50 p-3 font-mono text-sm text-charcoal-500">
          Encoded: {config.encoded}
        </p>
      ) : null}

      {revealedHints.length > 0 ? (
        <div className="space-y-2">
          {revealedHints.map((h, i) => (
            <p
              key={i}
              className="rounded-xl border border-gold/20 bg-gold/10 p-3 text-sm text-gold-500"
            >
              Hint: {h}
            </p>
          ))}
        </div>
      ) : null}

      {feedback ? (
        <p
          className={cn(
            'text-sm font-medium',
            feedback.includes('Correct') ? 'text-forest' : 'text-terracotta',
          )}
        >
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={disabled}
        >
          Submit Answer
        </Button>
        {stage.hints.map((h) => (
          <Button
            key={h.level}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => handleHint(h.level)}
          >
            Hint {h.level}
          </Button>
        ))}
      </div>
    </div>
  );
}
